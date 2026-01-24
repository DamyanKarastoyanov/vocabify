<?php

namespace App\Http\Web\Profile\Queries;

use Domain\Users\Models\User;
use Illuminate\Http\Request;

class ProfileSelectedValuesQuery
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
        $this->user->load(
            'profile.address',
        );

        $profile = $this->user->profile;
        $address = $profile?->address;
        $personalIdentificationNumberType = $profile?->personalIdentificationNumberType;
        $birthDate = $profile?->birth_date;

        return [
            'email' => $this->user->email,
            'profile_first_name' => $profile?->first_name ?? '',
            'profile_last_name' => $profile?->last_name ?? '',
            'profile_latin_full_name' => $profile?->latin_full_name ?? '',
            'profile_birth_date' => $birthDate && !empty($birthDate) ? (is_string($birthDate) ? $birthDate : $birthDate->format('Y-m-d')) : '',
            'profile_personal_identification_number_type' => $personalIdentificationNumberType ? [
                'value' => $personalIdentificationNumberType->id,
                'label' => $personalIdentificationNumberType->name,
            ] : [],
            'profile_personal_identification_number' => $profile?->personal_identification_number ?? '',
            'profile_phone' => $profile?->phone ?? '',
            'profile_driver_license' => $profile?->driver_license ?? '',
            'address_district' => $address && $address->district ? [
                'value' => $address->district->id,
                'label' => $address->district->name,
            ] : [],
            'address_municipality' => $address && $address->municipality ? [
                'value' => $address->municipality->id,
                'label' => $address->municipality->name,
            ] : [],
            'address_town' => $address && $address->town ? [
                'value' => $address->town->id,
                'label' => $address->town->name,
            ] : [],
            'address_postcode' => $address?->postal_code ?? '',
            'address_address' => $address?->address ?? '',
        ];
    }
}
