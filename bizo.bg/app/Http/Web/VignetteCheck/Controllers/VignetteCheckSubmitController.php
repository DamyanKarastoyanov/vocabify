<?php

namespace App\Http\Web\VignetteCheck\Controllers;

use Domain\Vehicles\Actions\CheckVignetteAction;
use Illuminate\Http\JsonResponse;
use Domain\Vehicles\Requests\CheckVignetteRequest;

class VignetteCheckSubmitController
{
    public function __construct(
        private readonly CheckVignetteAction $checkVignetteAction
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(CheckVignetteRequest $request): JsonResponse
    {
        $result = $this->checkVignetteAction->handle(
            $request->validated('registration_number'),
            'BG'
        );

        return response()->json($result);
    }
}

