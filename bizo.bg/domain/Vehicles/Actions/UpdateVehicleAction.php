<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;

class UpdateVehicleAction
{
    /**
     * Update-only action. Does not perform lookups or user sync.
     * Use VehicleResolverService::resolveVehicle() for orchestration.
     */
    public function handle(Vehicle $vehicle, array $vehicleData): Vehicle
    {
        $updateData = [];

        if (isset($vehicleData['vin'])) {
            $updateData['vin'] = $vehicleData['vin'];
        }

        if (isset($vehicleData['talon'])) {
            $updateData['talon'] = $vehicleData['talon'];
        }

        if (!empty($updateData)) {
            $vehicle->update($updateData);
        }

        return $vehicle->refresh();
    }
}
