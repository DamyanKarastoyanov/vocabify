<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;
use Illuminate\Support\Facades\Auth;

class DeleteVehicleAction
{
    public function handle(Vehicle $vehicle): bool
    {
        $userId = Auth::id();
        if (!$userId) {
            return false;
        }

        $detached = $vehicle->users()->detach($userId);

        if ($vehicle->users()->doesntExist()) {
            $vehicle->delete();
        }

        return (bool) $detached;
    }
}

