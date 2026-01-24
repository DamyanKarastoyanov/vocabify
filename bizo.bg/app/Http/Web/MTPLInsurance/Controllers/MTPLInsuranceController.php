<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Http\Web\MTPLInsurance\Queries\MTPLInsuranceQuery;
use App\Http\Web\MTPLInsurance\Resources\MTPLInsuranceResource;
use Illuminate\Http\Request;
use Inertia\Response;

class MTPLInsuranceController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('mtpl-insurance/mtpl-insurance', [
            'mtpl_insurance' => fn() => MTPLInsuranceResource::make((new MTPLInsuranceQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}
