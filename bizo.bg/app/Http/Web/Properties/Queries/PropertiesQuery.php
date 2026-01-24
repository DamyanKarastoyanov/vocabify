<?php

namespace App\Http\Web\Properties\Queries;

use App\Http\Web\Properties\Data\PropertiesColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use Domain\Users\Models\Property;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class PropertiesQuery
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
        $propertiesQuery = $this->getPropertiesQuery();
        $columns = PropertiesColumnsDefinition::getColumns();

        if (! $shouldIgnoreFiltering) {
            $propertiesQuery = $this->sortQuery($propertiesQuery, $columns);
            $propertiesQuery = $this->filterQuery($propertiesQuery, $columns);
            $propertiesQuery = $this->searchQuery($propertiesQuery, $columns);
        }

        return $propertiesQuery->get();
    }

    public function getPaginated(): LengthAwarePaginator
    {
        $propertiesQuery = $this->getPropertiesQuery();
        $columns = PropertiesColumnsDefinition::getColumns();

        $propertiesQuery = $this->sortQuery($propertiesQuery, $columns);
        $propertiesQuery = $this->filterQuery($propertiesQuery, $columns);
        $propertiesQuery = $this->searchQuery($propertiesQuery, $columns);

        return $propertiesQuery->paginate($this->perPage)->withQueryString();
    }

    protected function getPropertiesQuery(): Builder
    {
        $baseQuery = Property::query()
            ->leftJoin('addresses as address', function ($join) {
                $join->on('address.id', '=', 'properties.address_id')
                    ->whereNull('address.deleted_at');
            })
            ->leftJoin('axiom_districts as district', function ($join) {
                $join->on('district.id', '=', 'address.district_id');
            })
            ->leftJoin('axiom_municipalities as municipality', function ($join) {
                $join->on('municipality.id', '=', 'address.municipality_id');
            })
            ->leftJoin('axiom_towns as town', function ($join) {
                $join->on('town.id', '=', 'address.town_id');
            })
            ->addSelect(
                'properties.id',
                'properties.gross_floor_area_m2 as gross_floor_area',
            )
            ->selectRaw('
                CONCAT(
                    address.address,
                    IFNULL(CONCAT(", гр.", town.name), ""),
                    IFNULL(CONCAT(", общ. ", municipality.name), ""),
                    IFNULL(CONCAT(", обл.", district.name), ""),
                    IFNULL(CONCAT(", ", address.postal_code), "")
                ) as address
            ')
            ->where('properties.user_id', Auth::id());

        return Property::query()
            ->withTrashed()
            ->fromSub($baseQuery, 'sub');
    }
}
