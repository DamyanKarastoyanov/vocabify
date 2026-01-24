<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Person;

class UpdatePersonAction
{
    public function __construct(
        protected CreateAddressAction $createAddressAction,
        protected UpdateAddressAction $updateAddressAction,
        protected CreateProfileAction $createProfileAction,
        protected UpdateProfileAction $updateProfileAction
    ) {
        //
    }

    public function handle(Person $person, array $personData): Person
    {
        if (isset($personData['profile']['address'])) {
            if (!$person->profile->address_id) {
                $address = $this->createAddressAction->handle($personData['profile']['address']);
                $personData['profile']['address_id'] = $address->id ?? null;
            } else {
                $address = $this->updateAddressAction->handle($person->profile->address, $personData['profile']['address']);
                $personData['profile']['address_id'] = $address->id ?? null;
            }
        }

        if ($person->profile){
            $this->updateProfileAction->handle($person->profile, $personData['profile']);
        } else {
            $profile = $this->createProfileAction->handle($personData['profile']);
            $personData['profile_id'] = $profile->id ?? null;
        }

        $person->update($personData);

        return $person;
    }
}
