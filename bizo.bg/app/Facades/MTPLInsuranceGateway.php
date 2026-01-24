<?php

namespace App\Facades;

use App\Services\External\Broqee\MTPL\BroqeeMTPLInsuranceGateway;
use Illuminate\Support\Facades\Facade;

class MTPLInsuranceGateway extends Facade
{
    protected static function getFacadeAccessor()
    {
        return BroqeeMTPLInsuranceGateway::class;
    }
}
