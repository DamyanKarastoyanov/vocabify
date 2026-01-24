<?php

namespace App\Http\Web\Vehicles\Queries;

use Domain\Vehicles\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleDetailsQuery
{
    protected bool $isNewVehicle;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected ?Vehicle $vehicle,
    ) {
        $this->isNewVehicle = ! $this->vehicle || ! $this->vehicle->id;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        if (! $this->isNewVehicle) {
            $vehicle = $this->vehicle->load([
                'specification',
                'inspection',
                'vignettes' => fn ($query) => $query->orderByDesc('valid_to')->limit(1),
                'mtplChecks' => fn ($query) => $query->orderByDesc('created_at')->limit(1),
            ]);

            $data = [
                'id' => $vehicle->id,
                'reg_number' => $vehicle->reg_number,
                'vin' => $vehicle->vin,
                'talon' => $vehicle->talon,
                'title' => $vehicle->title,
                'specification' => $vehicle->specification ? [
                    'mark' => $vehicle->specification->mark,
                    'model' => $vehicle->specification->model,
                    'engine_volume' => $vehicle->specification->engine_volume,
                    'engine_power' => $vehicle->specification->engine_power,
                    'manufactured_year' => $vehicle->specification->manufactured_year,
                    'euro_standard' => $vehicle->specification->euro_standard,
                    'wheel_direction' => $vehicle->specification->wheel_direction,
                ] : null,
            ];

            if ($vehicle->inspection) {
                $data['inspection'] = [
                    'id' => $vehicle->inspection->id,
                    'next_inspection_date' => $vehicle->inspection->next_inspection_date->format('Y-m-d'),
                    'is_valid' => $vehicle->inspection->is_valid,
                    'is_periodic' => $vehicle->inspection->is_periodic,
                ];
            };

            $latestMtplCheck = $vehicle->mtplChecks->sortByDesc('created_at')->first();

            if ($latestMtplCheck) {
                $data['mtpl_check'] = [
                    'id' => $latestMtplCheck->id,
                    'has_valid_insurance' => $latestMtplCheck->has_valid_insurance,
                    'insurer' => $latestMtplCheck->insurer,
                    'start_date' => $latestMtplCheck->start_date?->format('Y-m-d'),
                    'end_date' => $latestMtplCheck->end_date?->format('Y-m-d'),
                    'raw_response' => $latestMtplCheck->raw_response,
                    'checked_at' => $latestMtplCheck->created_at?->toIso8601String(),
                ];
            }

            $latestVignette = $vehicle->vignettes->sortByDesc('valid_to')->first();

            if ($latestVignette) {
                $validFrom = $latestVignette->valid_from;
                $validTo = $latestVignette->valid_to;
                $isStillValid = null;

                if (! $validFrom && ! $validTo) {
                    $isStillValid = false;
                } elseif ($validTo) {
                    $validToStart = $validTo->copy()->startOfDay();
                    $isStillValid = ! now()->startOfDay()->isAfter($validToStart);
                }

                $data['vignette_check'] = [
                    'id' => $latestVignette->id,
                    'country' => $latestVignette->country,
                    'valid_from' => $validFrom?->format('Y-m-d'),
                    'valid_to' => $validTo?->format('Y-m-d'),
                    'vignette_number' => $latestVignette->vignette_number,
                    'has_valid_vignette' => $isStillValid,
                    'raw_response' => $latestVignette->raw_response,
                    'checked_at' => $latestVignette->created_at?->toIso8601String(),
                ];
            }

            return $data;
        }

        return [];
    }
}

