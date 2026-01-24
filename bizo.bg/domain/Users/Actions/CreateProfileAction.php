<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Profile;

class CreateProfileAction
{
    public function __construct(
        protected CreateAddressAction $createAddressAction
    ) {
        //
    }

    public function handle(array $profileData): Profile
    {
        if (!isset($profileData['address_id']) && isset($profileData['address'])) {
            $address = $this->createAddressAction->handle($profileData['address'] ?? []);
            $profileData['address_id'] = $address->id ?? null;
        }

        $profile = Profile::create($profileData);

        return $profile;
    }
}
