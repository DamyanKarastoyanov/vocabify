<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Person;

class CreatePersonAction
{
    public function __construct(
        protected CreateProfileAction $createProfileAction
    ) {
        //
    }

    public function handle(array $personData): Person
    {
        if(!isset($personData['profile_id'])) {
            $profile = $this->createProfileAction->handle($personData['profile'] ?? []);
            $personData['profile_id'] = $profile->id ?? null;
        }

        $person = Person::updateOrCreate(
            [
                'profile_id' => $personData['profile_id'] ?? null,
                'user_id' => $personData['user_id'] ?? null,
            ],
            $personData
        );

        return $person;
    }
}
