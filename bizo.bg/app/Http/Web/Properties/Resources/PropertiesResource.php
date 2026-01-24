<?php

namespace App\Http\Web\Properties\Resources;

use App\Http\Web\Properties\Data\PropertiesColumnsDefinition;
use App\Traits\Resource\TableResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertiesResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = PropertiesColumnsDefinition::getColumns();

        $properties = $this->addActionsToDataset($this->getDatasetForColumns($columns));

        return [
            'properties' => $properties,
            'columns' => $columns,
            'pagination' => $this->getPagination(),
            //'exportRouteName' => 'v2.properties.export',
        ];
    }

    protected function addActionsToDataset(array $dataset): array
    {
        $actions = $this->resource->getCollection()->map(function ($property) {
            return [
                'id' => $property->id,
                'actions' => $this->getPropertyActions($property),
            ];
        })->keyBy('id')->toArray();

        return array_map(function ($property) use ($actions) {

            $property['actions'] = $actions[$property['id']]['actions'] ?? [];

            return $property;
        }, $dataset);
    }

    protected function getPropertyActions($property): array
    {
        $actions = [
            'edit' => [
                'isEnabled' => true,
                'tooltip' => "Промени",
            ],
            'delete' => [
                'isEnabled' => true,
                'tooltip' => "Изтрий",
            ],
        ];

        return $actions;
    }
}
