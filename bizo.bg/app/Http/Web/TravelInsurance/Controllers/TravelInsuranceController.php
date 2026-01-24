<?php

namespace App\Http\Web\TravelInsurance\Controllers;

use App\Http\Web\TravelInsurance\Queries\TravelInsuranceQuery;
use App\Http\Web\TravelInsurance\Resources\TravelInsuranceResource;
use Illuminate\Http\Request;
use Inertia\Response;

class TravelInsuranceController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('travel-insurance/travel-insurance', [
            'travel_insurance' => fn() => TravelInsuranceResource::make((new TravelInsuranceQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}
