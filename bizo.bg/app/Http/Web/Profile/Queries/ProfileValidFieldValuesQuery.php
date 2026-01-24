<?php

namespace App\Http\Web\Profile\Queries;

use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Users\Models\User;
use Illuminate\Http\Request;

class ProfileValidFieldValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected User $user,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $address = $this->user->profile?->address;
        $hasAddress = $address?->district_id && $address?->municipality_id && $address?->town_id;

        return [
            'profile_personal_identification_number_type' => AxiomPersonalIdentificationNumberType::selectOptions(),
            'address_district' => AxiomDistrict::selectOptions(),
            'address_municipality' => $hasAddress ? AxiomMunicipality::selectOptions(
                AxiomMunicipality::query()->where('axiom_district_id', $this->user->profile->address->district->axiom_id),
            ) : [],
            'address_town' => $hasAddress ? AxiomTown::selectOptions(
                AxiomTown::query()->where('axiom_municipality_id', $this->user->profile->address->municipality->axiom_id),
            ) : [],
        ];
    }
}
