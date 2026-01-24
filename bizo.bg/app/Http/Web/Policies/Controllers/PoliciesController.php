<?php

namespace App\Http\Web\Policies\Controllers;

use App\Http\Web\Policies\Queries\PoliciesQuery;
use App\Http\Web\Policies\Resources\PoliciesResource;
use Illuminate\Http\Request;
use Inertia\Response;

class PoliciesController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('policies/policies', [
            'policies' => fn() => PoliciesResource::make((new PoliciesQuery($request))->get()),
        ]);
    }
}
