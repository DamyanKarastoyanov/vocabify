<?php

namespace App\Http\Web\VignetteCheck\Queries;

use Domain\Vehicles\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VignetteCheckValidFieldValuesQuery
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
        return [
            'vehicle' => $this->getVehicles(),
            'registration_number' => [],
        ];
    }

    /**
     * Get user's vehicles - only returns registration number
     */
    protected function getVehicles(): array
    {
        $user = Auth::user();

        if (!$user) {
            return [
                [
                    'value' => 0,
                    'label' => 'Нов автомобил',
                ]
            ];
        }

        $vehicles = Vehicle::query()
            ->select('vehicles.id', 'vehicles.reg_number')
            ->whereHas('users', fn($query) => $query->where('users.id', Auth::id()))
            ->get()
            ->map(function ($vehicle) {
                return [
                    'value' => $vehicle->id,
                    'label' => $vehicle->reg_number,
                    'reg_number' => $vehicle->reg_number,
                ];
            })
            ->toArray();

        // Add "New vehicle" option
        $vehicles = array_merge($vehicles, [
            [
                'value' => 0,
                'label' => 'Нов автомобил',
            ]
        ]);

        return $vehicles;
    }
}

