<?php

namespace App\Http\Web\Properties\Queries;

use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Users\Models\Property;
use Illuminate\Http\Request;

class PropertyDetailsValidFieldValuesQuery
{
    protected bool $isNewProperty;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Property $property,
    ) {
        $this->isNewProperty = ! $this->property->id;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        return [
            'district' => AxiomDistrict::selectOptions(),
            'municipality' => $this->isNewProperty ? [] : AxiomMunicipality::selectOptions(
                AxiomMunicipality::where('axiom_district_id', $this->property->address->district->axiom_id),
            ),
            'town' => $this->isNewProperty ? [] : AxiomTown::selectOptions(
                AxiomTown::where('axiom_municipality_id', $this->property->address->municipality->axiom_id),
            ),
        ];
    }
}
