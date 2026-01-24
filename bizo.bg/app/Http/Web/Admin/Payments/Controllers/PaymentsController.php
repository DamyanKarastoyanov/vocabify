<?php

namespace App\Http\Web\Admin\Payments\Controllers;

use App\Http\Web\Admin\Payments\Queries\PaymentsQuery;
use App\Http\Web\Admin\Payments\Resources\PaymentsResource;
use Illuminate\Http\Request;
use Inertia\Response;

class PaymentsController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('admin/payments/payments', [
            'payments' => fn() => PaymentsResource::make((new PaymentsQuery($request))->getPaginated()),
        ]);
    }
}
