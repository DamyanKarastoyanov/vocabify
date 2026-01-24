<?php

namespace Domain\Vehicles\Policies;

use Domain\Users\Models\User;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehiclePolicy
{
    use HandlesAuthorization;
    public function view(User $user, Vehicle $vehicle): bool
    {
        return $vehicle->users()->where('users.id', $user->id)->exists();
    }

    public function update(User $user, Vehicle $vehicle): bool
    {
        return $user->can('view', $vehicle);
    }

    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $user->can('view', $vehicle);
    }
}
