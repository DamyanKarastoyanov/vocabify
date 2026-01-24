<?php

namespace App\Http\Web\Persons\Queries;

use Domain\Users\Models\Person;
use Illuminate\Http\Request;

class PersonDetailsSelectedValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Person $person,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $this->person->load(
            'profile.address',
        );

        return [
            'first_name' => $this->person->profile->first_name,
            'last_name' => $this->person->profile->last_name,
            'latin_full_name' => $this->person->profile->latin_full_name,
            'personal_identification_number_type' => [
                'value' => $this->person->profile->personalIdentificationNumberType->id,
                'label' => $this->person->profile->personalIdentificationNumberType->name,
            ],
            'personal_identification_number' => $this->person->profile->personal_identification_number,
            'district' => $this->person->profile->address ? [
                'value' => $this->person->profile->address->district->id,
                'label' => $this->person->profile->address->district->name,
            ] : [],
            'municipality' => $this->person->profile->address ? [
                'value' => $this->person->profile->address->municipality->id,
                'label' => $this->person->profile->address->municipality->name,
            ] : [],
            'town' => $this->person->profile->address ? [
                'value' => $this->person->profile->address->town->id,
                'label' => $this->person->profile->address->town->name,
            ] : [],
            'postcode' => $this->person->profile->address ? $this->person->profile->address->postal_code : '',
            'address' => $this->person->profile->address ? $this->person->profile->address->address : '',
        ];
    }
}
