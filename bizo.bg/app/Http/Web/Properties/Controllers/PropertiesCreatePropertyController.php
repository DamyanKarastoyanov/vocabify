<?php

namespace App\Http\Web\Properties\Controllers;

use Domain\Users\Actions\CreatePropertyAction;
use Domain\Users\Requests\CreatePropertyRequest;
use Illuminate\Support\Facades\Auth;

class PropertiesCreatePropertyController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected CreatePropertyAction $createPropertyAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(CreatePropertyRequest $request): array
    {
        $propertyData = $request->validated();
        $propertyData['user_id'] = Auth::id();
        $property = $this->createPropertyAction->handle($propertyData);

        return [
            'success' => isset($property->id),
            'property' => $property,
        ];
    }
}

/*


fetch("http://local.bizo.bg/properties/create", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
    gross_floor_area_m2: 420,
    address: {
      district_id: 1,
      municipality_id: 1,
      town_id: 1,
      postal_code: "1000",
      address: "Test Address 123",
    },
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});


*/
