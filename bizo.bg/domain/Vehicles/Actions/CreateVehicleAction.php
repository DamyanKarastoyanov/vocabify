<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;

class CreateVehicleAction
{
    public function handle(array $vehicleData): Vehicle
    {
        if (empty($vehicleData['reg_number'])) {
            throw new \InvalidArgumentException('reg_number is required');
        }

        return Vehicle::create([
            'reg_number' => $vehicleData['reg_number'],
            'vin' => $vehicleData['vin'] ?? null,
            'talon' => $vehicleData['talon'] ?? null,
        ]);
    }
}

