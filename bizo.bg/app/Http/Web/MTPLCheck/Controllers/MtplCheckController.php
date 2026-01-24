<?php

namespace App\Http\Web\MTPLCheck\Controllers;

use App\Http\Web\MTPLCheck\Queries\MtplCheckQuery;
use App\Http\Web\MTPLCheck\Resources\MtplCheckResource;
use Illuminate\Http\Request;
use Inertia\Response;

class MtplCheckController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return inertia('mtpl-check/mtpl-check', [
            'mtpl_check' => MtplCheckResource::make((new MtplCheckQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}

