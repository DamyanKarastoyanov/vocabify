<?php

namespace App\Http\Web\Profile\Queries;

use Illuminate\Http\Request;
use Domain\Users\Models\User;

class ProfileFieldsAbilityQuery
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
     * Get the field ability states.
     * Returns an array where keys are field names and values are boolean indicating if the field is enabled.
     */
    public function get(): array
    {
        $profile = $this->user->profile;

        return [
            'email' => false,
            'profile_personal_identification_number_type' => $profile->isIdentityChangeable ? false : true,
            'profile_personal_identification_number' => $profile->isIdentityChangeable ? false : true,
        ];
    }
} 