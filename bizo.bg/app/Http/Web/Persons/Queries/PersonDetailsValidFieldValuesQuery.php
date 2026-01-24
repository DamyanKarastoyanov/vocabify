<?php

namespace App\Http\Web\Persons\Queries;

use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Users\Models\Person;
use Illuminate\Http\Request;

class PersonDetailsValidFieldValuesQuery
{
    protected bool $isNewPerson;
    protected bool $isNewAddress;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Person $person,
    ) {
        $this->isNewPerson = ! $this->person->id;
        $this->isNewAddress = ! $this->person->profile?->address?->id ?? true;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        return [
            'personal_identification_number_type' => AxiomPersonalIdentificationNumberType::selectOptions(),
            'district' => AxiomDistrict::selectOptions(),
            'municipality' => $this->isNewAddress ? [] : AxiomMunicipality::selectOptions(
                AxiomMunicipality::where('axiom_district_id', $this->person->profile->address->district->axiom_id),
            ),
            'town' => $this->isNewAddress ? [] : AxiomTown::selectOptions(
                AxiomTown::where('axiom_municipality_id', $this->person->profile->address->municipality->axiom_id),
            ),
        ];
    }
}
