<?php

namespace App\Http\Web\Vehicles\Controllers;

use Domain\Vehicles\Actions\DeleteVehicleAction;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Requests\DeleteVehicleRequest;

class VehiclesDeleteVehicleController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected DeleteVehicleAction $deleteVehicleAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(DeleteVehicleRequest $request, Vehicle $vehicle): array
    {
        $this->deleteVehicleAction->handle($vehicle);

        return [
            'success' => true,
        ];
    }
}

