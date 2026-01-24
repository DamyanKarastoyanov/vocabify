<?php

namespace App\Http\Web\Admin\Payments\Resources;

use App\Http\Web\Admin\Payments\Data\PaymentsColumnsDefinition;
use App\Traits\Resource\TableResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentsResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = PaymentsColumnsDefinition::getColumns();

        return [
            'payments' => $this->getDatasetForColumns($columns),
            'pagination' => $this->getPagination(),
            'columns' => $columns,
        ];
    }
}
