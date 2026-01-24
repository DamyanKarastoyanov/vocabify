<?php

namespace Domain\Users\Policies;

use Domain\Users\Models\Person;
use Domain\Users\Models\User;

class PersonPolicy
{
    public function view(User $user, Person $person): bool
    {
        return $person->user_id === $user->id;
    }

    public function edit(User $user, Person $person): bool
    {
        return $user->can('view', $person);
    }

    public function delete(User $user, Person $person): bool
    {
        return $user->can('view', $person);
    }
}
