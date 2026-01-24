<?php

namespace App\Http\Web\Admin\Policies\Resources;

use App\Http\Web\Admin\Policies\Data\PoliciesColumnsDefinition;
use App\Traits\Resource\TableResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PoliciesResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = PoliciesColumnsDefinition::getColumns();

        return [
            'policies' => $this->getDatasetForColumns($columns),
            'pagination' => $this->getPagination(),
            'columns' => $columns,
        ];
    }
}
