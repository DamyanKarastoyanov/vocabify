<?php

namespace App\Http\Web\HomeInsurance\Resources;

use Domain\Axiom\Global\Models\AxiomMunicipality;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeInsuranceMunicipalitiesResource extends JsonResource
{
    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        return $this->resource->map(function (AxiomMunicipality $municipality) {
            return [
                'value' => $municipality->id,
                'label' => $municipality->name,
            ];
        })
        ->toArray();
    }
}
