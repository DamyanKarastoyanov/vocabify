<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\User;

class ActivateUserAction
{
    public function handle(User $user): User
    {
        $user->is_active = true;
        $user->activated_at = now();
        $user->save();

        return $user;
    }
}
