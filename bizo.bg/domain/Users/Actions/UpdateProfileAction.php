<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Profile;

class UpdateProfileAction
{
    public function __construct(
        protected CreateAddressAction $createAddressAction,
        protected UpdateAddressAction $updateAddressAction
    ) {
        //
    }

    public function handle(Profile $profile, array $profileData): Profile
    {
        if (isset($profileData['address'])) {
            if (!$profile->address_id) {
                $address = $this->createAddressAction->handle($profileData['address']);
                $profileData['address_id'] = $address->id ?? null;
            } else {
                $address = $this->updateAddressAction->handle($profile->address, $profileData['address']);
                $profileData['address_id'] = $address->id ?? null;
            }
        }

        $profile->update($profileData);

        return $profile;
    }
}
