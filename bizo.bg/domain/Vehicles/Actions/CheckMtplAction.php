<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Services\MtplInspectionService;
use Domain\Vehicles\Mappers\MtplResponseMapper;
use Domain\Vehicles\Actions\CreateVehicleMtplCheckAction;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckMtplAction
{
    public function __construct(
        private readonly MtplInspectionService $mtplInspectionService,
        private readonly MtplResponseMapper $mapper,
        private readonly CreateVehicleMtplCheckAction $createVehicleMtplCheckAction,
    ) {}

    /**
     * Check MTPL insurance with database cache check
     */
    public function handle(string $registrationNumber): array
    {
        $vehicle = Vehicle::with('mtplChecks')->where('reg_number', $registrationNumber)->first();

        if ($vehicle && $vehicle->mtplChecks->isNotEmpty()) {
            $mtplCheck = $vehicle->mtplChecks->sortByDesc('created_at')->first();

            if ($this->isMtplCheckRecent($mtplCheck)) {
                return $this->formatCachedResponse($mtplCheck);
            }
        }

        $result = $this->mtplInspectionService->checkMtpl($registrationNumber);

        if (($result['success'] ?? false) && Auth::id()) {
            $this->persist($registrationNumber, $result);
        }

        return $result;
    }

    /**
     * Check if MTPL check is still valid based on end_date
     */
    private function isMtplCheckRecent($mtplCheck): bool
    {
        if (!$mtplCheck->end_date) {
            return false;
        }

        $endDate = Carbon::parse($mtplCheck->end_date)->startOfDay();
        $today = Carbon::now()->startOfDay();

        return !$today->isAfter($endDate);
    }

    /**
     * Format cached MTPL check data to match service response format
     */
    private function formatCachedResponse($mtplCheck): array
    {
        $response = $mtplCheck->raw_response ?? [];

        $response['cached'] = true;

        return $response;
    }

    /**
     * Persist MTPL check results to database
     */
    private function persist(string $registrationNumber, array $result): void
    {
        $dto = $this->mapper->map($result);

        $vehicleData = [
            'reg_number' => $registrationNumber,
        ];

        $this->createVehicleMtplCheckAction->handle($vehicleData, $dto->toPersistenceArray());
    }
}

