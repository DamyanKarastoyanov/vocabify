<?php

namespace App\Http\Web\Dashboard\Controllers;

use App\Http\Web\Dashboard\Queries\DashboardQuery;
use App\Http\Web\Dashboard\Resources\DashboardResource;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('dashboard/dashboard', [
            'dashboard' => fn() => DashboardResource::make((new DashboardQuery($request))->get()),
        ]);
    }
} 