<?php

namespace App\Http\Web\Addresses\Controllers;

use Domain\Users\Actions\DeleteAddressAction;
use Domain\Users\Models\Address;
use Domain\Users\Requests\DeleteAddressRequest;

class AddressesDeleteAddressController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected DeleteAddressAction $deleteAddressAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(DeleteAddressRequest $request, Address $address): array
    {
        $this->deleteAddressAction->handle($address);

        return [
            'success' => true,
        ];
    }
}
