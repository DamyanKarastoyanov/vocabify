<?php

namespace App\Http\Web\VignetteCheck\Controllers;

use App\Http\Web\VignetteCheck\Queries\VignetteCheckQuery;
use App\Http\Web\VignetteCheck\Resources\VignetteCheckResource;
use Illuminate\Http\Request;
use Inertia\Response;

class VignetteCheckController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return inertia('vignette-check/vignette-check', [
            'vignette_check' => VignetteCheckResource::make((new VignetteCheckQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}

