<?php

namespace App\Http\Web\Policies\Queries;

use App\Http\Web\Policies\Data\PoliciesColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use Domain\Insurance\Models\Policy;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PoliciesQuery
{
    protected int $perPage;

    use Filterable, Pageable, Searchable, Sortable;

    /**
     * Constructor.
     */
    public function __construct(protected Request $request)
    {
        $this->defaultTableOrder = 'created_at,desc';
        $this->setPerPage($request);
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
            ->leftJoin('policy_statuses as status', function ($join) {
                $join->on('status.id', '=', 'policies.policy_status_id');
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
                CASE
                    WHEN MIN(status.code) = "draft" THEN "Чернова"
                    WHEN MIN(status.code) = "pending_customer_action" THEN "Ти си на ход"
                    WHEN MIN(status.code) = "pending_insurer_confirmation" THEN "Одобрението пътува"
                    WHEN MIN(status.code) = "awaiting_payment_confirmation" THEN "Очаква плащане"
                    WHEN MIN(status.code) = "manual_review" THEN "Колегата го гледа"
                    WHEN MIN(status.code) = "active" THEN "Активна"
                    WHEN MIN(status.code) = "expired" THEN "Изтекла"
                    WHEN MIN(status.code) = "cancelled" THEN "Отменена"
                    WHEN MIN(status.code) = "declined" THEN "Отказана"
                    ELSE "-"
                END as status,
                MIN(policies.title) as title,
                MIN(policies.start_date) as start_date,
                MIN(policies.end_date) as end_date,
                MIN(policies.created_at) as created_at,
                MIN(insurance_company.name) as insurer_name,
                MIN(installment_summary.installment_summary) as installment_summary,
                MIN(installment_summary.installment_due_date) as installment_due_date,
                MIN(insurance_type.name) as insurance_type
            ')
            ->where('policies.user_id', Auth::id())
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
            ->selectRaw('
                MIN(
                    CASE
                        WHEN (
                            installments.paymentable_id IS NULL
                            OR (
                                (installments.paymentable_type = "Domain\\\Payment\\\Models\\\CardPayment" AND card_payments.payment_status_id != ?)
                                OR
                                (installments.paymentable_type = "Domain\\\Payment\\\Models\\\BankTransfer" AND bank_transfers.payment_status_id != ?)
                            )
                        )
                        THEN installments.due_date
                        ELSE NULL
                    END
                ) as installment_due_date
            ', [
                PaymentStatus::STATUSES['VERIFIED'],
                PaymentStatus::STATUSES['VERIFIED'],
            ])
            ->where('policies.user_id', Auth::id())
            ->groupBy('policies.id');
    }
}
