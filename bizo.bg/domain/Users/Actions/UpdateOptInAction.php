<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\User;


class UpdateOptInAction
{
    public function handle(User $user, bool $optIn): User
    {
        $user->opt_in = $optIn;
        $user->save();
        return $user;
    }
}
