<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Models\VehicleInspection;

class CreateVehicleInspectionAction
{
    public function __construct(
    ) {
        //
    }

    public function handle(Vehicle $vehicle, array $inspectionData): VehicleInspection
    {

        $inspection = VehicleInspection::updateOrCreate(
            [
                'vehicle_id' => $vehicle->id,
            ],
            [
                'next_inspection_date' => $inspectionData['next_inspection_date'],
                'is_valid' => $inspectionData['is_valid'],
                'is_periodic' => $inspectionData['is_periodic'],
                'raw_response' => $inspectionData['raw_response'],
            ]
        );

        return $inspection;
    }
}

