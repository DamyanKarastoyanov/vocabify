<?php

namespace Domain\Vehicles\Services;

use Domain\Vehicles\Actions\CreateVehicleAction;
use Domain\Vehicles\Actions\UpdateVehicleAction;
use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

class VehicleResolverService
{
    public function __construct(
        private CreateVehicleAction $createVehicleAction,
        private UpdateVehicleAction $updateVehicleAction,
    ) {}

    public function resolveVehicle(
        array $vehicleData,
        VehicleCreationSource $source = VehicleCreationSource::UNKNOWN,
        ?int $userId = null
    ): Vehicle {
        $regNumber = $this->normalizeRegNumber($vehicleData['reg_number'] ?? null);
        if (!$regNumber) {
            throw new \InvalidArgumentException('reg_number is required');
        }

        $vehicle = $this->findByRegNumberIncludingTrashed($regNumber);

        if ($vehicle?->trashed()) {
            $vehicle->restore();
        }

        if (!$vehicle) {
            $vehicle = $this->createOrRefetchOnRace($regNumber, $vehicleData, $source);
        } else {
            $vehicle = $this->applyUpdates($vehicle, $vehicleData, $source);
        }

        $userId = $userId ?? Auth::id();
        if ($userId) {
            $vehicle->users()->syncWithoutDetaching([$userId]);
        }

        return $vehicle;
    }

    private function createOrRefetchOnRace(string $regNumber, array $vehicleData, VehicleCreationSource $source): Vehicle
    {
        $payload = $this->buildPayload($regNumber, $vehicleData, $source, null);

        try {
            return $this->createVehicleAction->handle($payload);
        } catch (QueryException $e) {
            // Someone else inserted the reg_number or talon first
            $vehicle = $this->findByRegNumberIncludingTrashed($regNumber);

            if ($vehicle?->trashed()) {
                $vehicle->restore();
            }

            if ($vehicle) {
                // Apply updates that came with this request (esp. MTPL talon)
                return $this->applyUpdates($vehicle, $vehicleData, $source);
            }

            throw $e;
        }
    }

    private function applyUpdates(Vehicle $vehicle, array $vehicleData, VehicleCreationSource $source): Vehicle
    {
        $update = $this->buildPayload($vehicle->reg_number, $vehicleData, $source, $vehicle);

        if ($update === []) {
            return $vehicle;
        }

        try {
            return $this->updateVehicleAction->handle($vehicle, $update);
        } catch (QueryException $e) {
            // Race on UNIQUE(talon): two MTPL updates set same talon concurrently
            // Remove exists() check - let DB enforce uniqueness, catch and rethrow cleanly
            throw new \DomainException('Talon already assigned to another vehicle', previous: $e);
        }
    }

    private function buildPayload(string $regNumber, array $vehicleData, VehicleCreationSource $source, ?Vehicle $existingVehicle): array
    {
        $payload = [];

        // VIN: include if provided (create) or if changed (update)
        if (array_key_exists('vin', $vehicleData)) {
            if ($existingVehicle === null || $vehicleData['vin'] !== $existingVehicle->vin) {
                $payload['vin'] = $vehicleData['vin'];
            }
        }

        // Talon: MTPL_INSURANCE-only, replace rule (TA -> TB)
        if ($source === VehicleCreationSource::MTPL_INSURANCE && array_key_exists('talon', $vehicleData)) {
            $normalizedTalon = $this->normalizeTalon($vehicleData['talon']);

            if ($normalizedTalon !== null) {
                if ($existingVehicle === null) {
                    // Create: include talon
                    $payload['talon'] = $normalizedTalon;
                } elseif ($normalizedTalon !== $existingVehicle->talon) {
                    // Update: replace if different (DB will enforce uniqueness)
                    $payload['talon'] = $normalizedTalon;
                }
            }
        }

        // Reg number: always include for create
        if ($existingVehicle === null) {
            $payload['reg_number'] = $regNumber;
        }

        return $payload;
    }

    private function findByRegNumberIncludingTrashed(string $regNumber): ?Vehicle
    {
        return Vehicle::withTrashed()
            ->where('reg_number', $regNumber)
            ->first();
    }

    private function normalizeRegNumber(?string $regNumber): ?string
    {
        if ($regNumber === null) return null;
        $regNumber = strtoupper(trim($regNumber));
        return $regNumber !== '' ? $regNumber : null;
    }

    private function normalizeTalon($talon): ?string
    {
        if ($talon === null) return null;
        $talon = trim((string) $talon);
        return $talon !== '' ? $talon : null;
    }
}
