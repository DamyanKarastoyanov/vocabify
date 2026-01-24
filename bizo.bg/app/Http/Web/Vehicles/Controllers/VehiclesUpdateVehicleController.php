<?php

namespace App\Http\Web\Vehicles\Controllers;

use Domain\Vehicles\Actions\UpdateVehicleAction;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Requests\UpdateVehicleRequest;

class VehiclesUpdateVehicleController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected UpdateVehicleAction $updateVehicleAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Vehicle $vehicle, UpdateVehicleRequest $request): array
    {
        $vehicleData = $request->validated();
        $vehicle = $this->updateVehicleAction->handle($vehicle, $vehicleData);

        return [
            'success' => isset($vehicle->id),
            'vehicle' => $vehicle->load('specification'),
        ];
    }
}

