<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\User;

class CreateUserAction
{
    public function __construct(
        protected CreateProfileAction $createProfileAction
    ) {
        //
    }

    public function handle(array $userData): User
    {
        if(!isset($userData['profile_id'])) {
            $profile = $this->createProfileAction->handle($userData['profile'] ?? []);
            $userData['profile_id'] = $profile->id;
        }

        $user = new User;
        $user->fill($userData);
        $user->save();

        $user->assignRole('user');

        return $user;
    }
}
