<?php

namespace App\Http\Web\Vehicles\Queries;

use App\Http\Web\Vehicles\Data\VehiclesColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class VehiclesQuery
{
    protected int $perPage;

    use Filterable, Pageable, Searchable, Sortable;

    /**
     * Constructor.
     */
    public function __construct(protected Request $request)
    {
        $this->defaultTableOrder = 'id,desc';
        $this->setPerPage($request);
    }

    /**
     * Get the results.
     */
    public function get(bool $shouldIgnoreFiltering = false): Collection
    {
        $vehiclesQuery = $this->getVehiclesQuery();
        $columns = VehiclesColumnsDefinition::getColumns();

        if (! $shouldIgnoreFiltering) {
            $vehiclesQuery = $this->sortQuery($vehiclesQuery, $columns);
            $vehiclesQuery = $this->filterQuery($vehiclesQuery, $columns);
            $vehiclesQuery = $this->searchQuery($vehiclesQuery, $columns);
        }

        return $vehiclesQuery->get();
    }

    public function getPaginated(): LengthAwarePaginator
    {
        $vehiclesQuery = $this->getVehiclesQuery();
        $columns = VehiclesColumnsDefinition::getColumns();

        $vehiclesQuery = $this->sortQuery($vehiclesQuery, $columns);
        $vehiclesQuery = $this->filterQuery($vehiclesQuery, $columns);
        $vehiclesQuery = $this->searchQuery($vehiclesQuery, $columns);

        return $vehiclesQuery->paginate($this->perPage)->withQueryString();
    }

    protected function getVehiclesQuery(): Builder
    {
        return Vehicle::query()
            ->with(['specification', 'inspection'])
            ->whereHas('users', fn($query) => $query->where('users.id', Auth::id()));
    }
}

