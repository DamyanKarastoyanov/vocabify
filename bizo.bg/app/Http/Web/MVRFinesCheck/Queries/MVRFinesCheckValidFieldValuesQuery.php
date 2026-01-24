<?php

namespace App\Http\Web\MVRFinesCheck\Queries;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MVRFinesCheckValidFieldValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        return [
            'profile' => $this->getUserProfile(),
            'egn' => [],
            'driving_licence_number' => [],
        ];
    }

    /**
     * Get user's profile with only identification numbers and driver license
     */
    protected function getUserProfile(): array
    {
        $user = Auth::user();
        if (!$user || !$user->profile) {
            return [];
        }

        $userProfile = $user->profile;

        // If identification_type is not 1, make the number empty
        $personalIdentificationNumber = $userProfile->personal_identification_number_type_id === 1
            ? $userProfile->personal_identification_number
            : null;

        return [
            [
                'value' => $user->id,
                'label' => $userProfile->first_name . ' ' . $userProfile->last_name,
                'personal_identification_number' => $personalIdentificationNumber,
                'driver_license' => $userProfile->driver_license,
            ],
            [
                'value' => 0,
                'label' => 'Нов профил',
            ]
        ];
    }
}

