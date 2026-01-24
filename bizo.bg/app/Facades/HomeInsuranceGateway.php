<?php

namespace App\Facades;

use App\Services\External\Axiom\Home\AxiomHomeInsuranceGateway;
use Illuminate\Support\Facades\Facade;

class HomeInsuranceGateway extends Facade
{
    protected static function getFacadeAccessor()
    {
        return AxiomHomeInsuranceGateway::class;
    }
}
