<?php

namespace App\Http\Web\Addresses\Controllers;

use Domain\Users\Actions\UpdateAddressAction;
use Domain\Users\Models\Address;
use Domain\Users\Requests\UpdateAddressRequest;

class AddressesUpdateAddressController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected UpdateAddressAction $updateAddressAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Address $address, UpdateAddressRequest $request): array
    {
        $addressData = $request->validated();
        $address = $this->updateAddressAction->handle($address, $addressData);

        return [
            'success' => isset($address->id),
            'address' => $address,
        ];
    }
}

/*


fetch("http://local.bizo.bg/addresses/19/update", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
    address: "На Владко СУПЕР специалния адрес!",
  }),
  method: "PUT",
  mode: "cors",
  credentials: "include"
});


*/
