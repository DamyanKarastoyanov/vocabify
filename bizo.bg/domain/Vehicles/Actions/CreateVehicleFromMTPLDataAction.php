<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Actions\CreateVehicleSpecificationAction;
use Domain\Vehicles\Services\VehicleResolverService;

class CreateVehicleFromMTPLDataAction
{
    public function __construct(
        private VehicleResolverService $vehicleResolverService,
        private CreateVehicleSpecificationAction $createVehicleSpecificationAction,
    ) {
        //
    }

    public function handle(array $vehicleData): Vehicle
    {
        $vehicle = $this->vehicleResolverService->resolveVehicle([
            'vin' => $vehicleData['vin'] ?? null,
            'talon' => $vehicleData['talon'] ?? null,
            'reg_number' => $vehicleData['reg_number'],
        ], VehicleCreationSource::MTPL_INSURANCE);

        $year = $vehicleData['year'] ? (int) substr($vehicleData['year'], 0, 4) : now()->year;

        $specificationData = [
            'mark' => $vehicleData['mark_name'],
            'model' => $vehicleData['model_name'],
            'engine_volume' => $vehicleData['engine_volume'],
            'engine_power' => (string) $vehicleData['engine_power_kw'],
            'manufactured_year' => $year,
            'wheel_direction' => $vehicleData['wheel_direction'],
        ];

        $this->createVehicleSpecificationAction->handle($vehicle, $specificationData);

        return $vehicle->load('specification');
    }
}

