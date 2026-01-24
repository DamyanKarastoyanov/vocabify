<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\MVRFinesCheck;
use Domain\Vehicles\Services\MVRFinesService;
use Domain\Vehicles\Mappers\MVRFinesResponseMapper;
use Domain\Vehicles\Actions\CreateMVRFinesCheckAction;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckMVRFinesAction
{
    public function __construct(
        private readonly MVRFinesService $mvrFinesService,
        private readonly MVRFinesResponseMapper $mapper,
        private readonly CreateMVRFinesCheckAction $createMVRFinesCheckAction,
    ) {}

    /**
     * Check MVR fines with database cache check
     */
    public function handle(string $egn, string $drivingLicenceNumber): array
    {
        $existingCheck = MVRFinesCheck::with('obligations')
            ->where('egn', $egn)
            ->where('driving_licence_number', $drivingLicenceNumber)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($existingCheck && $this->isMVRFinesCheckRecent($existingCheck)) {
            return $this->formatCachedResponse($existingCheck);
        }

        $result = $this->mvrFinesService->checkMVRFines($egn, $drivingLicenceNumber);

        if (($result['success'] ?? false) && Auth::id()) {
            $this->persist($result);
        }

        return $result;
    }

    /**
     * Check if MVR fines check is still valid (within 24 hours)
     */
    private function isMVRFinesCheckRecent(MVRFinesCheck $check): bool
    {
        $checkDate = Carbon::parse($check->created_at);
        $now = Carbon::now();

        return $checkDate->diffInHours($now) < 24;
    }

    /**
     * Format cached MVR fines check data to match service response format
     */
    private function formatCachedResponse(MVRFinesCheck $check): array
    {
        $response = $check->raw_response ?? [];

        $response['cached'] = true;

        return $response;
    }

    /**
     * Persist MVR fines check results to database
     */
    private function persist(array $result): void
    {
        $dto = $this->mapper->map($result);

        $checkData = $dto->toPersistenceArray();

        $obligationsData = [];
        foreach ($dto->obligations as $obligationDTO) {
            $obligationsData[] = $obligationDTO->toPersistenceArray();
        }

        $this->createMVRFinesCheckAction->handle($checkData, $obligationsData);
    }
}

