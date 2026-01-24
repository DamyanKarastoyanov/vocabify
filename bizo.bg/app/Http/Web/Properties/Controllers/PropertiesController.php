<?php

namespace App\Http\Web\Properties\Controllers;

use App\Http\Web\Properties\Queries\PropertiesQuery;
use App\Http\Web\Properties\Resources\PropertiesResource;
use Illuminate\Http\Request;
use Inertia\Response;

class PropertiesController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('properties/properties', [
            'properties' => fn() => PropertiesResource::make((new PropertiesQuery($request))->getPaginated()),
        ]);
    }
}
