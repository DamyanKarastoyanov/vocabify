<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\User;

class DeactivateUserAction
{
    public function handle(User $user): User
    {
        $user->update(['is_active' => false]);

        return $user;
    }
}
