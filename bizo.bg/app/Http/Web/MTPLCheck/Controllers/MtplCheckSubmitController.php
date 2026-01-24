<?php

namespace App\Http\Web\MTPLCheck\Controllers;

use Domain\Vehicles\Actions\CheckMtplAction;
use Illuminate\Http\JsonResponse;
use Domain\Vehicles\Requests\CheckMtplRequest;

class MtplCheckSubmitController
{
    public function __construct(
        private readonly CheckMtplAction $checkMtplAction
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(CheckMtplRequest $request): JsonResponse
    {
        $result = $this->checkMtplAction->handle(
            $request->validated('registration_number')
        );

        return response()->json($result);
    }
}

