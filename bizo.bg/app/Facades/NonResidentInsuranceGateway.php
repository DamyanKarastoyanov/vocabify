<?php

namespace App\Facades;

use App\Services\External\Axiom\NonResident\AxiomNonResidentsInsuranceGateway;
use Illuminate\Support\Facades\Facade;

class NonResidentInsuranceGateway extends Facade
{
    protected static function getFacadeAccessor()
    {
        return AxiomNonResidentsInsuranceGateway::class;
    }
}
