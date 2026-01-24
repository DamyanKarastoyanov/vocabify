<?php

namespace Domain\Users\Policies;

use Domain\Users\Models\Address;
use Domain\Users\Models\User;

class AddressPolicy
{
    public function view(User $user, Address $address): bool
    {
        return Address::forUser($user->id)
            ->whereKey($address->id)
            ->exists();
    }

    public function edit(User $user, Address $address): bool
    {
        return $user->can('view', $address);
    }

    public function delete(User $user, Address $address): bool
    {
        return $user->can('view', $address);
    }
}
