<?php

namespace App\Http\Web\Addresses\Controllers;

use App\Http\Web\Addresses\Queries\AddressesQuery;
use App\Http\Web\Addresses\Resources\AddressesResource;
use Illuminate\Http\Request;
use Inertia\Response;

class AddressesController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('addresses/addresses', [
            'addresses' => fn() => AddressesResource::make((new AddressesQuery($request))->getPaginated()),
        ]);
    }
}
