<?php

namespace App\Http\Web\Admin\Policies\Queries;

use App\Http\Web\Admin\Payments\Data\PaymentsColumnsDefinition;
use App\Http\Web\Admin\Policies\Data\PoliciesColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use App\Traits\Query\HasReportingPeriod;
use Domain\Insurance\Models\Policy;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PoliciesQuery
{
    protected int $perPage;

    use Filterable, Pageable, Searchable, Sortable, HasReportingPeriod;

    /**
     * Constructor.
     */
    public function __construct(protected Request $request)
    {
        $this->defaultTableOrder = 'id,desc';
        $this->setPerPage($request);
        $this->initializeReportingPeriod($request, [
            'dateStringFormat' => 'Y-m-d',
            'defaultPeriodPeriod' => 'allTime',
        ]);
    }

    /**
     * Get the results.
     */
    public function get(bool $shouldIgnoreFiltering = false): Collection
    {
        $policiesQuery = $this->getPoliciesQuery();
        $columns = PoliciesColumnsDefinition::getColumns();

        if (! $shouldIgnoreFiltering) {
            $policiesQuery = $this->sortQuery($policiesQuery, $columns);
            $policiesQuery = $this->filterQuery($policiesQuery, $columns);
            $policiesQuery = $this->searchQuery($policiesQuery, $columns);
        }

        return $policiesQuery->get();
    }

    public function getPaginated(): LengthAwarePaginator
    {
        $policiesQuery = $this->getPoliciesQuery();
        $columns = PoliciesColumnsDefinition::getColumns();

        $policiesQuery = $this->sortQuery($policiesQuery, $columns);
        $policiesQuery = $this->filterQuery($policiesQuery, $columns);
        $policiesQuery = $this->searchQuery($policiesQuery, $columns);

        return $policiesQuery->paginate($this->perPage)->withQueryString();
    }

    protected function getPoliciesQuery(): Builder
    {
        $installmentSummaryQuery = $this->getInstallmentSummaryQuery();

        $baseQuery = Policy::query()
            ->leftJoinSub($installmentSummaryQuery, 'installment_summary', function ($join) {
                $join->on('installment_summary.policy_id', '=', 'policies.id');
            })
            ->leftJoin('insurance_types as insurance_type', function ($join) {
                $join->on('insurance_type.id', '=', 'policies.insurance_type_id');
            })
            ->leftJoin('axiom_currencies as currency', function ($join) {
                $join->on('currency.id', '=', 'policies.axiom_currency_id');
            })
            ->leftJoin('users as user', function ($join) {
                $join->on('user.id', '=', 'policies.user_id');
            })
            ->leftJoin('profiles as profile', function ($join) {
                $join->on('profile.id', '=', 'user.profile_id');
            })
            ->leftJoin('axiom_policy_statuses as status', function ($join) {
                $join->on('status.id', '=', 'policies.axiom_policy_status_id');
            })
            ->leftJoin('policy_statuses as internal_status', function ($join) {
                $join->on('internal_status.id', '=', 'policies.policy_status_id');
            })
            ->leftJoin('insurance_companies as insurance_company', function ($join) {
                $join->on('insurance_company.id', '=', 'policies.insurance_company_id');
            })
            ->leftJoin('installments', 'policies.id', '=', 'installments.policy_id')
            ->leftJoin('card_payments', function ($join) {
                $join->on('card_payments.id', '=', 'installments.paymentable_id')
                    ->where('installments.paymentable_type', '=', 'Domain\\Payment\\Models\\CardPayment');
            })
            ->leftJoin('bank_transfers', function ($join) {
                $join->on('bank_transfers.id', '=', 'installments.paymentable_id')
                    ->where('installments.paymentable_type', '=', 'Domain\\Payment\\Models\\BankTransfer');
            })
            ->selectRaw('
                policies.id,
                MIN(policies.policy_number) as policy_number,
                MIN(policies.title) as title,
                MIN(status.name) as policy_status,
                CASE
                    WHEN MIN(internal_status.code) = "draft" THEN "Чернова"
                    WHEN MIN(internal_status.code) = "pending_customer_action" THEN "Ти си на ход"
                    WHEN MIN(internal_status.code) = "pending_insurer_confirmation" THEN "Одобрението пътува"
                    WHEN MIN(internal_status.code) = "awaiting_payment_confirmation" THEN "Очаква плащане"
                    WHEN MIN(internal_status.code) = "manual_review" THEN "Колегата го гледа"
                    WHEN MIN(internal_status.code) = "active" THEN "Активна"
                    WHEN MIN(internal_status.code) = "expired" THEN "Изтекла"
                    WHEN MIN(internal_status.code) = "cancelled" THEN "Отменена"
                    WHEN MIN(internal_status.code) = "declined" THEN "Отказана"
                    ELSE "-"
                END as policy_internal_status,
                MIN(policies.start_date) as start_date,
                MIN(policies.end_date) as end_date,
                MIN(insurance_company.name) as insurer,
                MIN(installment_summary.installment_summary) as payment_progress,
                MIN(insurance_type.name) as insurance_type,
                CONCAT(MIN(profile.first_name), " ", MIN(profile.last_name)) as user,
                CONCAT(
                    FORMAT(MIN(policies.total_amount), 2),
                    " ",
                    MIN(currency.axiom_id)
                ) as amount,
                CONCAT(
                    FORMAT(MIN(policies.commission), 2),
                    " ",
                    MIN(currency.axiom_id)
                ) as commission
            ')
            ->when($this->start_date, function ($query) {
                $query->whereDate('policies.start_date', '>=', $this->start_date)
                    ->whereDate('policies.start_date', '<=', $this->end_date);
            })
            ->groupBy('policies.id');

        return Policy::query()
            ->withTrashed()
            ->fromSub($baseQuery, 'sub');
    }

    protected function getInstallmentSummaryQuery(): Builder
    {
        return Policy::query()
            ->leftJoin('installments', 'policies.id', '=', 'installments.policy_id')
            ->leftJoin('card_payments', function ($join) {
                $join->on('card_payments.id', '=', 'installments.paymentable_id')
                    ->where('installments.paymentable_type', '=', 'Domain\\Payment\\Models\\CardPayment');
            })
            ->leftJoin('bank_transfers', function ($join) {
                $join->on('bank_transfers.id', '=', 'installments.paymentable_id')
                    ->where('installments.paymentable_type', '=', 'Domain\\Payment\\Models\\BankTransfer');
            })
            ->addSelect(
                'policies.id as policy_id',
            )
            ->selectRaw('
                CONCAT(
                    COUNT(
                        CASE
                            WHEN (
                                (installments.paymentable_type = "Domain\\\Payment\\\Models\\\CardPayment" AND card_payments.payment_status_id = ?)
                                OR
                                (installments.paymentable_type = "Domain\\\Payment\\\Models\\\BankTransfer" AND bank_transfers.payment_status_id = ?)
                            )
                            THEN 1
                            ELSE NULL
                        END
                    ),
                    "/",
                    COUNT(installments.id),
                    " вноски"
                ) as installment_summary
            ', [
                PaymentStatus::STATUSES['VERIFIED'],
                PaymentStatus::STATUSES['VERIFIED'],
            ])
            ->groupBy('policies.id');
    }
}
