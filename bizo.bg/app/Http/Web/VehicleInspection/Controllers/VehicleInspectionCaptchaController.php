<?php

namespace App\Http\Web\VehicleInspection\Controllers;

use Domain\Vehicles\Services\RtaInspectionService;
use Illuminate\Http\JsonResponse;

class VehicleInspectionCaptchaController
{
    public function __construct(
        private readonly RtaInspectionService $rtaInspectionService
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(): JsonResponse
    {
        $captcha = $this->rtaInspectionService->getCaptcha();

        return response()->json($captcha);
    }
}
