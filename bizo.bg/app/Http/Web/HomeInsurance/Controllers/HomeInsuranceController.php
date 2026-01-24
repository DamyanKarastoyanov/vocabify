<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use App\Http\Web\HomeInsurance\Queries\HomeInsuranceQuery;
use App\Http\Web\HomeInsurance\Resources\HomeInsuranceResource;
use Illuminate\Http\Request;
use Inertia\Response;

class HomeInsuranceController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('home-insurance/home-insurance', [
            'home_insurance' => fn() => HomeInsuranceResource::make((new HomeInsuranceQuery($request))->get()),
            'errors' => $request->errors,
        ]);
    }
}
