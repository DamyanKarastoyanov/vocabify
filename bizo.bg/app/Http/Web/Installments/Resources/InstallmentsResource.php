<?php

namespace App\Http\Web\Installments\Resources;

use App\Http\Web\Installments\Data\InstallmentsColumnsDefinition;
use App\Traits\Resource\TableResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentsResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = InstallmentsColumnsDefinition::getColumns();

        return [
            'installments' => $this->_getDatasetForColumns($columns),
            'columns' => $columns,
        ];
    }

    protected function _getDatasetForColumns(array $columns): array
    {
        return $this->resource->map(function ($resource) use ($columns) {
            $row = $this->resourceToColumnsMapper($columns, $resource);

            if ($this->additionalDataFields) {
                $row = array_merge($row, $this->resourceToColumnsMapper($this->additionalDataFields, $resource));
            }

            return $row;
        })->toArray();
    }
}
