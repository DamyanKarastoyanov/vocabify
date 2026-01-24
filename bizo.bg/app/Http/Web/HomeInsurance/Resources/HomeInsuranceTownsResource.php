<?php

namespace App\Http\Web\HomeInsurance\Resources;

use Domain\Axiom\Global\Models\AxiomTown;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeInsuranceTownsResource extends JsonResource
{
    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        return $this->resource->map(function (AxiomTown $town) {
            return [
                'value' => $town->id,
                'label' => $town->name,
                'postcode' => $town->postcode,
            ];
        })
        ->toArray();
    }
}
