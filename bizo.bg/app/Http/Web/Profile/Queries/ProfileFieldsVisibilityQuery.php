<?php

namespace App\Http\Web\Profile\Queries;

use Illuminate\Http\Request;

class ProfileFieldsVisibilityQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request
    ) {
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $resetPasswordRequest = $this->request->input('resetPasswordRequest');

        if ($resetPasswordRequest === 'open') {
            return [
                'current_password' => true,
                'password' => true,
                'password_confirmation' => true,
            ];
        }

        return [
            'email' => true,
            'profile_first_name' => true,
            'profile_last_name' => true,
            'profile_latin_full_name' => true,
            'profile_birth_date' => true,
            'profile_personal_identification_number_type' => true,
            'profile_personal_identification_number' => true,
            'profile_phone' => true,
            'profile_driver_license' => true,
            'address_district' => true,
            'address_municipality' => true,
            'address_town' => true,
            'address_postcode' => true,
            'address_address' => true,
        ];
    }
}
