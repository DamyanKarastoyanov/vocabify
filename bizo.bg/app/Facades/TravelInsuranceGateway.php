<?php

namespace App\Facades;

use App\Services\External\Axiom\Travel\AxiomTravelInsuranceGateway;
use Illuminate\Support\Facades\Facade;

class TravelInsuranceGateway extends Facade
{
    protected static function getFacadeAccessor()
    {
        return AxiomTravelInsuranceGateway::class;
    }
}
