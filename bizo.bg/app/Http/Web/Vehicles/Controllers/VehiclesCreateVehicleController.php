<?php

namespace App\Http\Web\Vehicles\Controllers;

use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Requests\CreateVehicleRequest;
use Domain\Vehicles\Services\VehicleResolverService;

class VehiclesCreateVehicleController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected VehicleResolverService $vehicleResolverService,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(CreateVehicleRequest $request): array
    {
        $vehicleData = $request->validated();
        
        $vehicle = $this->vehicleResolverService->resolveVehicle($vehicleData, VehicleCreationSource::MANUAL);

        return [
            'success' => isset($vehicle->id),
            'vehicle' => $vehicle->load('specification'),
        ];
    }
}

