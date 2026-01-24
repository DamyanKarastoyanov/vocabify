<?php

namespace App\Http\Web\Vehicles\Resources;

use App\Http\Web\Vehicles\Data\VehiclesColumnsDefinition;
use App\Traits\Resource\TableResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehiclesResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = VehiclesColumnsDefinition::getColumns();

        $this->additionalDataFields = [
            'title' => [
                'key' => 'title',
            ],
        ];

        return [
            'vehicles' => $this->_getDatasetForColumns($columns),
            'columns' => $columns,
        ];
    }

    protected function _getDatasetForColumns(array $columns): array
    {
        return $this->resource->map(function ($vehicle) use ($columns) {
            $row = [];

            foreach ($columns as $column) {
                $key = $column['key'];

                // Map nested relationship attributes to flat structure
                $row[$key] = match($key) {
                    'mark' => $vehicle->specification?->mark,
                    'model' => $vehicle->specification?->model,
                    'manufactured_year' => $vehicle->specification?->manufactured_year,
                    'next_inspection_date' => $vehicle->inspection?->next_inspection_date,
                    'is_valid' => $vehicle->inspection?->is_valid,
                    'is_periodic' => $vehicle->inspection?->is_periodic,
                    default => $vehicle->$key ?? null,
                };
            }

            if ($this->additionalDataFields) {
                $row = array_merge($row, $this->resourceToColumnsMapper($this->additionalDataFields, $vehicle));
            }

            return $this->castBooleanColumns($row);
        })->toArray();
    }

    protected function castBooleanColumns(array $row): array
    {
        foreach (['is_valid', 'is_periodic'] as $key) {
            if (array_key_exists($key, $row)) {
                $row[$key] = $row[$key] !== null ? (bool) $row[$key] : null;
            }
        }

        return $row;
    }
}
