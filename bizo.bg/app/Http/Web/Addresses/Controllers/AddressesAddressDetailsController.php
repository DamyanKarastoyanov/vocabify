<?php

namespace App\Http\Web\Addresses\Controllers;

use App\Http\Web\Addresses\Queries\AddressDetailsQuery;
use App\Http\Web\Addresses\Resources\AddressDetailsResource;
use Domain\Users\Models\Address;
use Domain\Users\Requests\GetAddressDetailsRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressesAddressDetailsController
{
    public function __invoke(GetAddressDetailsRequest $request, ?Address $address): JsonResource
    {
        return AddressDetailsResource::make((new AddressDetailsQuery($request, $address))->get());
    }
}
