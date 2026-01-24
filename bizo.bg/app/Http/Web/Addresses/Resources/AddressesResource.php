<?php

namespace App\Http\Web\Addresses\Resources;

use App\Http\Web\Addresses\Data\AddressesColumnsDefinition;
use App\Traits\Resource\TableResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressesResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = AddressesColumnsDefinition::getColumns();

        $addresses = $this->addActionsToDataset($this->getDatasetForColumns($columns));

        return [
            'addresses' => $addresses,
            'columns' => $columns,
            'pagination' => $this->getPagination(),
            //'exportRouteName' => 'v2.addresses.export',
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
