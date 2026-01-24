<?php

namespace Domain\Users\Policies;

use Domain\Users\Models\User;
use Domain\Users\Models\Property;

class PropertyPolicy
{
    public function view(User $user, Property $property): bool
    {
        return $property->user_id === $user->id;
    }

    public function edit(User $user, Property $property): bool
    {
        return $user->can('view', $property);
    }

    public function delete(User $user, Property $property): bool
    {
        return $user->can('view', $property);
    }
}
