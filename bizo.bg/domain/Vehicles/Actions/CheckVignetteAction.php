<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Services\VignetteInspectionService;
use Domain\Vehicles\Mappers\VignetteResponseMapper;
use Domain\Vehicles\Actions\CreateVehicleVignetteAction;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckVignetteAction
{
    public function __construct(
        private readonly VignetteInspectionService $vignetteInspectionService,
        private readonly VignetteResponseMapper $mapper,
        private readonly CreateVehicleVignetteAction $createVehicleVignetteAction,
    ) {}

    /**
     * Check vignette status with database cache check
     */
    public function handle(string $registrationNumber, string $country = 'BG'): array
    {
        $vehicle = Vehicle::with('vignettes')->where('reg_number', $registrationNumber)->first();

        if ($vehicle && $vehicle->vignettes->isNotEmpty()) {
            $vignette = $vehicle->vignettes->where('country', $country)->sortByDesc('created_at')->first();

            if ($vignette && $this->isVignetteRecent($vignette)) {
                return $this->formatCachedResponse($vignette);
            }
        }

        $result = $this->vignetteInspectionService->checkVignette($registrationNumber, $country);

        if ($result['success'] && Auth::id()) {
            $this->persist($registrationNumber, $country, $result);
        }

        return $result;
    }

    /**
     * Check if vignette is still valid based on valid_to
     */
    private function isVignetteRecent($vignette): bool
    {
        if (!$vignette->valid_to) {
            return false;
        }

        $validTo = Carbon::parse($vignette->valid_to)->startOfDay();
        $today = Carbon::now()->startOfDay();

        return !$today->isAfter($validTo);
    }

    /**
     * Format cached vignette data to match service response format
     */
    private function formatCachedResponse($vignette): array
    {
        $response = $vignette->raw_response ?? [];

        $response['cached'] = true;

        return $response;
    }

    /**
     * Persist vignette check results to database
     */
    private function persist(string $registrationNumber, string $country, array $result): void
    {
        $dto = $this->mapper->map($result, $country);

        $vehicleData = [
            'reg_number' => $registrationNumber,
        ];

        $this->createVehicleVignetteAction->handle($vehicleData, $dto->toPersistenceArray());
    }
}

