<?php

namespace App\Http\Web\Vehicles\Controllers;

use App\Http\Web\Vehicles\Queries\VehiclesQuery;
use App\Http\Web\Vehicles\Resources\VehiclesResource;
use Illuminate\Http\Request;
use Inertia\Response;

class VehiclesController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('vehicles/vehicles', [
            'vehicles' => fn() => VehiclesResource::make((new VehiclesQuery($request))->get()),
        ]);
    }
}

