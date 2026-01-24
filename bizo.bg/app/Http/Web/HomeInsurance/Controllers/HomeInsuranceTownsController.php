<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use App\Http\Web\HomeInsurance\Queries\HomeInsuranceTownsQuery;
use App\Http\Web\HomeInsurance\Resources\HomeInsuranceTownsResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeInsuranceTownsController
{
    public function __invoke(Request $request, int $axiom_municipality_id): JsonResource
    {
        return HomeInsuranceTownsResource::make((new HomeInsuranceTownsQuery($request, $axiom_municipality_id))->get());
    }
}
