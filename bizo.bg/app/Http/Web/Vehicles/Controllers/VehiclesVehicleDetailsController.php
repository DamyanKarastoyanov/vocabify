<?php

namespace App\Http\Web\Vehicles\Controllers;

use App\Http\Web\Vehicles\Queries\VehicleDetailsQuery;
use App\Http\Web\Vehicles\Resources\VehicleDetailsResource;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Requests\GetVehicleDetailsRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class VehiclesVehicleDetailsController
{
    public function __invoke(GetVehicleDetailsRequest $request, ?Vehicle $vehicle): JsonResource
    {
        return VehicleDetailsResource::make((new VehicleDetailsQuery($request, $vehicle))->get());
    }
}

