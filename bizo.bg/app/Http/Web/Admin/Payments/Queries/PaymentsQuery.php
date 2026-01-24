<?php

namespace App\Http\Web\Admin\Payments\Queries;

use App\Http\Web\Admin\Payments\Data\PaymentsColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use App\Traits\Query\HasReportingPeriod;
use Domain\Payment\Models\Installment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentsQuery
{
    protected int $perPage;

    use Filterable, Pageable, Searchable, Sortable, HasReportingPeriod;

    /**
     * Constructor.
     */
    public function __construct(protected Request $request)
    {
        $this->defaultTableOrder = 'date_time,desc';
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
        $paymentsQuery = $this->getPaymentsQuery();
        $columns = PaymentsColumnsDefinition::getColumns();

        if (! $shouldIgnoreFiltering) {
            $paymentsQuery = $this->sortQuery($paymentsQuery, $columns);
            $paymentsQuery = $this->filterQuery($paymentsQuery, $columns);
            $paymentsQuery = $this->searchQuery($paymentsQuery, $columns);
        }

        return $paymentsQuery->get();
    }

    public function getPaginated(): LengthAwarePaginator
    {
        $paymentsQuery = $this->getPaymentsQuery();
        $columns = PaymentsColumnsDefinition::getColumns();

        $paymentsQuery = $this->sortQuery($paymentsQuery, $columns);
        $paymentsQuery = $this->filterQuery($paymentsQuery, $columns);
        $paymentsQuery = $this->searchQuery($paymentsQuery, $columns);

        return $paymentsQuery->paginate($this->perPage)->withQueryString();
    }

    protected function getPaymentsQuery(): Builder
    {
        $baseQuery = Installment::query()
            ->leftJoin('axiom_currencies as currency', function ($join) {
                $join->on('currency.id', '=', 'installments.axiom_currency_id');
            })
            ->leftJoin('policies as policy', function ($join) {
                $join->on('policy.id', '=', 'installments.policy_id');
            })
            ->leftJoin('insurance_types as insurance_type', function ($join) {
                $join->on('insurance_type.id', '=', 'policy.insurance_type_id');
            })
            ->leftJoin('users as user', function ($join) {
                $join->on('user.id', '=', 'policy.user_id');
            })
            ->leftJoin('profiles as profile', function ($join) {
                $join->on('profile.id', '=', 'user.profile_id');
            })
            ->leftJoin('insurance_companies as insurance_company', function ($join) {
                $join->on('insurance_company.id', '=', 'policy.insurance_company_id');
            })
            ->leftJoin('card_payments', function ($join) {
                $join->on('card_payments.id', '=', 'installments.paymentable_id')
                    ->where('installments.paymentable_type', '=', 'Domain\\Payment\\Models\\CardPayment');
            })
            ->leftJoin('bank_transfers', function ($join) {
                $join->on('bank_transfers.id', '=', 'installments.paymentable_id')
                    ->where('installments.paymentable_type', '=', 'Domain\\Payment\\Models\\BankTransfer');
            })
            ->leftJoin('users as verified_user', function ($join) {
                $join->on('verified_user.id', '=', 'bank_transfers.verified_by');
            })
            ->leftJoin('profiles as verified_profile', function ($join) {
                $join->on('verified_profile.id', '=', 'verified_user.profile_id');
            })
            ->leftJoin('payment_statuses as payment_status', function ($join) {
                $join->on('payment_status.id', '=', 'card_payments.payment_status_id')
                    ->orOn('payment_status.id', '=', 'bank_transfers.payment_status_id');
            })
            ->addSelect(
                'user.id as user_id',
                'policy.id as policy_id',
                'policy.policy_number as policy',
                'insurance_type.name as insurance_type'
            )
            ->selectRaw('
                COALESCE(policy.payment_reference, policy.policy_number) as payment_reference,
                CONCAT(profile.first_name, " ", profile.last_name) as user_name,
                COALESCE(bank_transfers.id, card_payments.id) as id,
                DATE(COALESCE(bank_transfers.verified_at, card_payments.created_at)) as verified_at,
                COALESCE(CONCAT(verified_profile.first_name, " ", verified_profile.last_name), \'-\') as verified_by,
                COALESCE(bank_transfers.reference_number, card_payments.reference_number) as reference_number,
                DATE(COALESCE(bank_transfers.created_at, card_payments.created_at)) as date_time,
                COALESCE(bank_transfers.notes, card_payments.notes, \'-\') as notes,
                COALESCE(payment_status.name, "Очаква потвърждение") as status,
                CASE
                    WHEN
                        bank_transfers.id IS NOT NULL
                    THEN
                        \'Банков Превод\'
                    ELSE
                        \'Плащане с карта\'
                END as payment_method,
                CONCAT(
                    FORMAT(installments.amount_due, 2),
                    " ",
                    currency.axiom_id
                ) as amount
            ')
            ->whereHas('payment');

        return Installment::query()
            ->withTrashed()
            ->fromSub($baseQuery, 'sub')
            ->when($this->start_date, function ($query) {
                $query->whereDate('date_time', '>=', $this->start_date)
                    ->whereDate('date_time', '<=', $this->end_date);
            });
    }
}
