<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Models\VehicleInspection;
use Domain\Vehicles\Services\RtaInspectionService;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckVehicleInspectionAction
{
    public function __construct(
        private readonly RtaInspectionService $rtaInspectionService,
        private readonly CreateVehicleFromInspectionDataAction $createVehicleFromInspectionDataAction,
    ) {}

    /**
     * Check vehicle inspection with database cache check
     */
    public function handle(
        string $registrationNumber,
        string $captchaCode,
        string $captchaSession
    ): array {
        $vehicle = Vehicle::with('inspection')->where('reg_number', $registrationNumber)->first();

        if ($vehicle && $vehicle->inspection) {
            if ($this->isVehicleInspectionRecent($vehicle->inspection)) {
                return $this->formatCachedResponse($vehicle->inspection);
            }
        }

        $result = $this->rtaInspectionService->checkInspection(
            $registrationNumber,
            $captchaCode,
            $captchaSession
        );

        if (!($result['success'] ?? false)) {
            return $result;
        }

        // Check if vehicle data was found in the RTA response
        $found = $result['data']['found'] ?? false;

        if ($found && Auth::id()) {
            $this->createVehicleFromInspectionDataAction->handle($result);
        }

        return $result;
    }

    /**
     * Check if vehicle inspection check is still valid (within 24 hours)
     */
    private function isVehicleInspectionRecent(VehicleInspection $inspection): bool
    {
        $checkDate = Carbon::parse($inspection->created_at);
        $now = Carbon::now();

        return $checkDate->diffInHours($now) < 24;
    }

    /**
     * Format cached vehicle inspection check data to match service response format
     */
    private function formatCachedResponse(VehicleInspection $inspection): array
    {
        $response = $inspection->raw_response ?? [];

        $response['cached'] = true;

        return $response;
    }
}

