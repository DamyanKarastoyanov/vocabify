<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Models\VehicleVignette;
use Domain\Vehicles\Services\VehicleResolverService;

class CreateVehicleVignetteAction
{
    public function __construct(
        private VehicleResolverService $vehicleResolverService
    ) {
        //
    }

    public function handle(array $vehicleData, array $vignetteData): VehicleVignette
    {
        $regNumber = $vehicleData['reg_number'] ?? null;

        if (!$regNumber) {
            throw new \InvalidArgumentException('Vehicle registration number is required');
        }

        $vehicle = $this->vehicleResolverService->resolveVehicle($vehicleData, VehicleCreationSource::VIGNETTE);

        $vignette = VehicleVignette::updateOrCreate(
            [
                'vehicle_id' => $vehicle->id,
                'country' => $vignetteData['country'] ?? 'BG',
            ],
            $vignetteData
        );

        return $vignette;
    }
}

