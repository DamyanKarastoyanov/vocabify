<?php

namespace Domain\Insurance\Policies;

use Domain\Insurance\Models\Policy;
use Domain\Users\Models\User;

class PolicyPolicy
{
    public function view(User $user, Policy $policy): bool
    {
        return $policy->user_id === $user->id;
    }
}
