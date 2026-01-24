<?php

namespace App\Http\Web\Installments\Controllers;

use App\Http\Web\Installments\Queries\InstallmentsQuery;
use App\Http\Web\Installments\Resources\InstallmentsResource;
use Illuminate\Http\Request;
use Inertia\Response;

class InstallmentsController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('installments/installments', [
            'installments' => fn() => InstallmentsResource::make((new InstallmentsQuery($request))->get()),
            'errors' => $request->query('errors'),
        ]);
    }
}
