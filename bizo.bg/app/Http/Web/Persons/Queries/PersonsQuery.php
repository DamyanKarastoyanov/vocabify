<?php

namespace App\Http\Web\Persons\Queries;

use App\Http\Web\Persons\Data\PersonsColumnsDefinition;
use App\Traits\Query\Filterable;
use App\Traits\Query\Pageable;
use App\Traits\Query\Searchable;
use App\Traits\Query\Sortable;
use Domain\Users\Models\Person;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class PersonsQuery
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
        $personsQuery = $this->getPersonsQuery();
        $columns = PersonsColumnsDefinition::getColumns();

        if (! $shouldIgnoreFiltering) {
            $personsQuery = $this->sortQuery($personsQuery, $columns);
            $personsQuery = $this->filterQuery($personsQuery, $columns);
            $personsQuery = $this->searchQuery($personsQuery, $columns);
        }

        return $personsQuery->get();
    }

    public function getPaginated(): LengthAwarePaginator
    {
        $personsQuery = $this->getPersonsQuery();
        $columns = PersonsColumnsDefinition::getColumns();

        $personsQuery = $this->sortQuery($personsQuery, $columns);
        $personsQuery = $this->filterQuery($personsQuery, $columns);
        $personsQuery = $this->searchQuery($personsQuery, $columns);

        return $personsQuery->paginate($this->perPage)->withQueryString();
    }

    protected function getPersonsQuery(): Builder
    {
        $baseQuery = Person::query()
            ->leftJoin('profiles as profile', function ($join) {
                $join->on('profile.id', '=', 'persons.profile_id')
                    ->whereNull('profile.deleted_at');
            })
            ->leftJoin('axiom_personal_identification_number_types as pin_type', function ($join) {
                $join->on('pin_type.id', '=', 'profile.personal_identification_number_type_id');
            })
            ->leftJoin('addresses as address', function ($join) {
                $join->on('address.id', '=', 'profile.address_id')
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
                'persons.id',
                'profile.first_name as first_name',
                'profile.last_name as last_name',
                'profile.personal_identification_number as personal_identification_number',
                'pin_type.name as personal_identification_number_type_name')
            ->selectRaw('
                CONCAT(
                    address.address,
                    IFNULL(CONCAT(", гр.", town.name), ""),
                    IFNULL(CONCAT(", общ. ", municipality.name), ""),
                    IFNULL(CONCAT(", обл.", district.name), "")
                ) as address
            ')
            ->where('persons.user_id', Auth::id());

        return Person::query()
            ->withTrashed()
            ->fromSub($baseQuery, 'sub');
    }
}
