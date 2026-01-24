<?php

namespace App\Http\Web\VehicleInspection\Controllers;

use App\Http\Web\VehicleInspection\Queries\VehicleInspectionQuery;
use App\Http\Web\VehicleInspection\Resources\VehicleInspectionResource;
use Illuminate\Http\Request;
use Inertia\Response;

class VehicleInspectionController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return inertia('vehicle-inspection/vehicle-inspection', [
            'vehicle_inspection' => VehicleInspectionResource::make((new VehicleInspectionQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}
