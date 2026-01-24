<?php

namespace App\Http\Web\Addresses\Queries;

use App\Http\Web\Addresses\Data\AddressesColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use Domain\Users\Models\Address;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class AddressesQuery
{
    protected int $perPage;

    use Filterable, Pageable, Searchable, Sortable;

    /**
     * Constructor.
     */
    public function __construct(protected Request $request)
    {
        $this->defaultTableOrder = 'id,asc';
        $this->setPerPage($request);
    }

    /**
     * Get the results.
     */
    public function get(bool $shouldIgnoreFiltering = false): Collection
    {
        $addressesQuery = $this->getAddressesQuery();
        $columns = AddressesColumnsDefinition::getColumns();

        if (! $shouldIgnoreFiltering) {
            $addressesQuery = $this->sortQuery($addressesQuery, $columns);
            $addressesQuery = $this->filterQuery($addressesQuery, $columns);
            $addressesQuery = $this->searchQuery($addressesQuery, $columns);
        }

        return $addressesQuery->get();
    }

    public function getPaginated(): LengthAwarePaginator
    {
        $addressesQuery = $this->getAddressesQuery();
        $columns = AddressesColumnsDefinition::getColumns();

        $addressesQuery = $this->sortQuery($addressesQuery, $columns);
        $addressesQuery = $this->filterQuery($addressesQuery, $columns);
        $addressesQuery = $this->searchQuery($addressesQuery, $columns);

        return $addressesQuery->paginate($this->perPage)->withQueryString();
    }

    protected function getAddressesQuery(): Builder
    {
        $baseQuery = Address::query()
            ->leftJoin('axiom_districts as district', function ($join) {
                $join->on('district.id', '=', 'addresses.district_id');
            })
            ->leftJoin('axiom_municipalities as municipality', function ($join) {
                $join->on('municipality.id', '=', 'addresses.municipality_id');
            })
            ->leftJoin('axiom_towns as town', function ($join) {
                $join->on('town.id', '=', 'addresses.town_id');
            })
            ->addSelect(
                'addresses.id',
                'addresses.address',
                'district.name as district',
                'municipality.name as municipality',
                'town.name as town',
                'addresses.postal_code',
            )
            ->forUser(Auth::id());

        return Address::query()
            ->withTrashed()
            ->fromSub($baseQuery, 'sub');
    }
}
