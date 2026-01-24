<?php

namespace App\Http\Web\Admin\Policies\Controllers;

use App\Http\Web\Admin\Policies\Queries\PoliciesQuery;
use App\Http\Web\Admin\Policies\Resources\PoliciesResource;
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
        return inertia('admin/policies/policies', [
            'policies' => fn() => PoliciesResource::make((new PoliciesQuery($request))->getPaginated()),
        ]);
    }
}
