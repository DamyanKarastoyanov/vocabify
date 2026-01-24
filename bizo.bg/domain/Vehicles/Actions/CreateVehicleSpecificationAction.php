<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Models\VehicleSpecification;

class CreateVehicleSpecificationAction
{
    public function __construct(
    ) {
        //
    }

    public function handle(Vehicle $vehicle, array $specificationData): VehicleSpecification
    {
        $data = [];

        if (isset($specificationData['mark'])) {
            $data['mark'] = $specificationData['mark'];
        }

        if (isset($specificationData['model'])) {
            $data['model'] = $specificationData['model'];
        }

        if (isset($specificationData['engine_volume'])) {
            $data['engine_volume'] = $specificationData['engine_volume'];
        }

        if (isset($specificationData['engine_power'])) {
            $data['engine_power'] = $specificationData['engine_power'];
        }

        if (isset($specificationData['manufactured_year'])) {
            $data['manufactured_year'] = $specificationData['manufactured_year'];
        }

        if (isset($specificationData['euro_standard'])) {
            $data['euro_standard'] = $specificationData['euro_standard'];
        }

        if (isset($specificationData['wheel_direction'])) {
            $data['wheel_direction'] = match ($specificationData['wheel_direction']) {
                1 => VehicleSpecification::WHEEL_DIRECTIONS['LEFT'],
                2 => VehicleSpecification::WHEEL_DIRECTIONS['RIGHT'],
                default => null,
            };
        }

        $specification = VehicleSpecification::updateOrCreate(
            ['vehicle_id' => $vehicle->id],
            $data
        );

        return $specification;
    }
}

