<?php

namespace App\Http\Web\VehicleInspection\Controllers;

use Illuminate\Http\JsonResponse;
use Domain\Vehicles\Requests\CheckInspectionRequest;
use Domain\Vehicles\Actions\CheckVehicleInspectionAction;

class VehicleInspectionCheckController
{
    public function __construct(
        private readonly CheckVehicleInspectionAction $checkVehicleInspectionAction
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(CheckInspectionRequest $request): JsonResponse
    {
        $result = $this->checkVehicleInspectionAction->handle(
            $request->validated('registration_number'),
            $request->validated('captcha_code'),
            $request->validated('captcha_session')
        );

        return response()->json($result);
    }
}
