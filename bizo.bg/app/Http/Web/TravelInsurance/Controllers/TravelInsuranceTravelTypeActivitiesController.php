<?php

namespace App\Http\Web\TravelInsurance\Controllers;

use App\Http\Web\TravelInsurance\Queries\TravelInsuranceTravelTypeActivitiesQuery;
use App\Http\Web\TravelInsurance\Resources\TravelInsuranceTravelTypeActivitiesResource;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TravelInsuranceTravelTypeActivitiesController
{
    public function __invoke(Request $request, AxiomTravelInsuranceTravelType $axiom_travel_type): JsonResource
    {
        return TravelInsuranceTravelTypeActivitiesResource::make((new TravelInsuranceTravelTypeActivitiesQuery($request, $axiom_travel_type))->get());
    }
}
