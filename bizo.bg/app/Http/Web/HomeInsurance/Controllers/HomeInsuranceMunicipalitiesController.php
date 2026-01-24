<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use App\Http\Web\HomeInsurance\Queries\HomeInsuranceMunicipalitiesQuery;
use App\Http\Web\HomeInsurance\Resources\HomeInsuranceMunicipalitiesResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeInsuranceMunicipalitiesController
{
    public function __invoke(Request $request, int $axiom_district_id): JsonResource
    {
        return HomeInsuranceMunicipalitiesResource::make((new HomeInsuranceMunicipalitiesQuery($request, $axiom_district_id))->get());
    }
}
