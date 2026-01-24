<?php

namespace App\Http\Web\NonResidentInsurance\Controllers;

use App\Http\Web\NonResidentInsurance\Queries\NonResidentInsuranceQuery;
use App\Http\Web\NonResidentInsurance\Resources\NonResidentInsuranceResource;
use Illuminate\Http\Request;
use Inertia\Response;

class NonResidentInsuranceController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('non-resident-insurance/non-resident-insurance', [
            'non_resident_insurance' => fn() => NonResidentInsuranceResource::make((new NonResidentInsuranceQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}
