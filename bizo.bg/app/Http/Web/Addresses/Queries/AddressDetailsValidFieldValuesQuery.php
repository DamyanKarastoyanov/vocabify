<?php

namespace App\Http\Web\Addresses\Queries;

use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Users\Models\Address;
use Illuminate\Http\Request;

class AddressDetailsValidFieldValuesQuery
{

    protected bool $isNewAddress;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Address $address,
    ) {
        $this->isNewAddress = ! $this->address->id;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        return [
            'district' => AxiomDistrict::selectOptions(),
            'municipality' => $this->isNewAddress ? [] : AxiomMunicipality::selectOptions(
                AxiomMunicipality::where('axiom_district_id', $this->address->district->axiom_id),
            ),
            'town' => $this->isNewAddress ? [] : AxiomTown::selectOptions(
                AxiomTown::where('axiom_municipality_id', $this->address->municipality->axiom_id),
            ),
        ];
    }
}
