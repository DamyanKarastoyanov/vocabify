<?php

namespace App\Http\Web\VehicleInspection\Queries;

use Illuminate\Http\Request;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Support\Facades\Auth;


class VehicleInspectionValidFieldValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        // Vehicle inspection form only has text input fields, no select options
        return [
            'vehicle' => $this->getVehicles(),
            'registration_number' => [],
        ];
    }

    protected function getVehicles(): array
    {
        $user = Auth::user();
        if (!$user) {
            return [];
        }

        $vehicles = Vehicle::query()
            ->with('specification')
            ->whereHas('users', fn($query) => $query->where('users.id', Auth::id()))
            ->get()
            ->map(function ($vehicle) {
                return [
                    'value' => $vehicle->id,
                    'label' => $vehicle->title,
                    'number' => $vehicle->reg_number,
                    'talon' => $vehicle->talon,
                ];
            })
            ->toArray();

        // Add "New vehicle" option
        $vehicles = array_merge( $vehicles, [
            [
                'value' => 0,
                'label' => 'Нов автомобил',
            ]
        ]);

        return $vehicles;
    }
}

