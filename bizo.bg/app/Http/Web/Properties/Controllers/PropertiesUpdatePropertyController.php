<?php

namespace App\Http\Web\Properties\Controllers;

use Domain\Users\Actions\UpdatePropertyAction;
use Domain\Users\Models\Property;
use Domain\Users\Requests\UpdatePropertyRequest;

class PropertiesUpdatePropertyController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected UpdatePropertyAction $updatePropertyAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Property $property, UpdatePropertyRequest $request): array
    {
        $propertyData = $request->validated();
        $property = $this->updatePropertyAction->handle($property, $propertyData);

        return [
            'success' => isset($property->id),
            'property' => $property,
        ];
    }
}

/*


fetch("http://local.bizo.bg/properties/7/update", {
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
      district_id: 2,
      municipality_id: 2,
      town_id: 2,
      postal_code: "2000",
      address: "Test Address 2-123",
    },
  }),
  method: "PUT",
  mode: "cors",
  credentials: "include"
});


*/
