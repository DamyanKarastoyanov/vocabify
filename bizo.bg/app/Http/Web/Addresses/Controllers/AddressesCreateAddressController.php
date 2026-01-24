<?php

namespace App\Http\Web\Addresses\Controllers;

use Domain\Users\Actions\CreateAddressAction;
use Domain\Users\Requests\CreateAddressRequest;

class AddressesCreateAddressController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected CreateAddressAction $createAddressAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(CreateAddressRequest $request): array
    {
        $addressData = $request->validated();
        $address = $this->createAddressAction->handle($addressData);

        return [
            'success' => isset($address->id),
            'address' => $address,
        ];
    }
}

/*


fetch("http://local.bizo.bg/addresses/create", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
      district_id: 10,
      municipality_id: 10,
      town_id: 10,
      postal_code: "7777",
      address: "Комуна за Гача наркомани",
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});


*/
