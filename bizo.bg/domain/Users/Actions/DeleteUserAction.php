<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\User;

class DeleteUserAction
{
    public function handle(User $user): void
    {
        $user->delete();
    }
}
