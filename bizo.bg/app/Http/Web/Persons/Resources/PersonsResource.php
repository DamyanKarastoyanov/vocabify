<?php

namespace App\Http\Web\Persons\Resources;

use App\Http\Web\Persons\Data\PersonsColumnsDefinition;
use App\Traits\Resource\TableResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonsResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = PersonsColumnsDefinition::getColumns();

        $persons = $this->addActionsToDataset($this->getDatasetForColumns($columns));

        return [
            'persons' => $persons,
            'columns' => $columns,
            'pagination' => $this->getPagination(),
        ];
    }

    protected function addActionsToDataset(array $dataset): array
    {
        $actions = $this->resource->getCollection()->map(function ($person) {
            return [
                'id' => $person->id,
                'actions' => $this->getPersonActions($person),
            ];
        })->keyBy('id')->toArray();

        return array_map(function ($person) use ($actions) {
            $person['actions'] = $actions[$person['id']]['actions'] ?? [];

            return $person;
        }, $dataset);
    }

    protected function getPersonActions($person): array
    {
        return [
            'edit' => [
                'isEnabled' => true,
                'tooltip' => "Edit",
            ],
            'delete' => [
                'isEnabled' => true,
                'tooltip' => "Delete",
            ],
        ];
    }
}
