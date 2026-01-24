<?php

namespace App\Http\Web\MVRFinesCheck\Controllers;

use App\Http\Web\MVRFinesCheck\Queries\MVRFinesCheckQuery;
use App\Http\Web\MVRFinesCheck\Resources\MVRFinesCheckResource;
use Illuminate\Http\Request;
use Inertia\Response;

class MVRFinesCheckController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return inertia('mvr-fines-check/mvr-fines-check', [
            'mvr_fines_check' => MVRFinesCheckResource::make((new MVRFinesCheckQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}

