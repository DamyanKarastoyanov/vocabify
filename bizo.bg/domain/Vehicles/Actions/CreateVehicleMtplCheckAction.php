<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Models\VehicleMtplCheck;
use Domain\Vehicles\Services\VehicleResolverService;

class CreateVehicleMtplCheckAction
{
    public function __construct(
        private VehicleResolverService $vehicleResolverService
    ) {}

    public function handle(array $vehicleData, array $mtplCheckData): VehicleMtplCheck
    {
        $regNumber = $vehicleData['reg_number'] ?? null;

        if (!$regNumber) {
            throw new \InvalidArgumentException('Vehicle registration number is required');
        }

        $vehicle = $this->vehicleResolverService->resolveVehicle($vehicleData, VehicleCreationSource::MTPL_CHECK);

        $mtplCheck = VehicleMtplCheck::updateOrCreate(
            [
                'vehicle_id' => $vehicle->id,
            ],
            $mtplCheckData
        );

        return $mtplCheck;
    }
}

