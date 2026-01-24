<?php

namespace App\Http\Web\Installments\Queries;

use App\Http\Web\Installments\Data\InstallmentsColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use App\Traits\Query\TypeFilterable;
use Domain\Payment\Models\Installment;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class InstallmentsQuery
{
    protected int $perPage;

    public const TYPE_ALL = 'all';
    public const TYPE_COMPLETED = 'completed';
    public const TYPE_PENDING = 'pending';

    use Filterable, Pageable, Searchable, Sortable, TypeFilterable;

    /**
     * Constructor.
     */
    public function __construct(protected Request $request, protected int $policy_id = 0, protected string $type = self::TYPE_ALL)
    {
        $this->defaultTableOrder = 'created_at,desc';
        $this->type = $request->query('type') ?? $type;
        $this->setPerPage($request);
    }

    /**
     * Get the results.
     */
    public function get(bool $shouldIgnoreFiltering = false): Collection
    {
        $installmentsQuery = $this->getInstallmentsQuery();
        $columns = InstallmentsColumnsDefinition::getColumns();

        if (! $shouldIgnoreFiltering) {
            $installmentsQuery = $this->sortQuery($installmentsQuery, $columns);
            $installmentsQuery = $this->filterQuery($installmentsQuery, $columns);
            $installmentsQuery = $this->searchQuery($installmentsQuery, $columns);
        }

        return $installmentsQuery->get();
    }

    public function getPaginated(): LengthAwarePaginator
    {
        $installmentsQuery = $this->getInstallmentsQuery();
        $columns = InstallmentsColumnsDefinition::getColumns();

        $installmentsQuery = $this->sortQuery($installmentsQuery, $columns);
        $installmentsQuery = $this->filterQuery($installmentsQuery, $columns);
        $installmentsQuery = $this->searchQuery($installmentsQuery, $columns);

        return $installmentsQuery->paginate($this->perPage)->withQueryString();
    }

    protected function getInstallmentsQuery(): Builder
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
            ->leftJoin('payment_statuses as payment_status', function ($join) {
                $join->on('payment_status.id', '=', 'card_payments.payment_status_id')
                    ->orOn('payment_status.id', '=', 'bank_transfers.payment_status_id');
            })
            ->addSelect(
                'installments.id',
                'installments.created_at as created_at',
                'policy.title as title',
                'policy.end_date as end_date',
                'insurance_company.name as insurer_name',
                'insurance_type.name as insurance_type',
            )
            ->selectRaw('
                COALESCE(payment_status.name, "Pending") as status,
                CONCAT(
                    FORMAT(installments.amount_due, 2),
                    " ",
                    currency.axiom_id
                ) as amount
            ')
            ->where('policy.user_id', Auth::id());

        if ($this->policy_id) {
            $baseQuery->where('installments.policy_id', $this->policy_id);
        }

        $baseQuery = $this->typeFilterQuery($baseQuery);

        return Installment::query()
            ->withTrashed()
            ->fromSub($baseQuery, 'sub');
    }

    protected function addTypeFilteringToQuery(Builder $query): Builder
    {
        switch ($this->type) {
            case self::TYPE_COMPLETED:
                $query->where(function ($query) {
                    $query->where('payment_status.id', PaymentStatus::STATUSES['VERIFIED'])
                        ->orWhere('payment_status.id', PaymentStatus::STATUSES['REJECTED']);
                });
                break;
            case self::TYPE_PENDING:
                $query->where(function ($query) {
                    $query->where('payment_status.id', PaymentStatus::STATUSES['PENDING'])
                        ->orWhereNull('payment_status.id');
                });
                break;
            case self::TYPE_ALL:
            default:
                $query;
        }

        return $query;
    }
}
