<?php

namespace App\Http\Web\Persons\Controllers;

use Domain\Users\Actions\CreatePersonAction;
use Domain\Users\Requests\CreatePersonRequest;
use Illuminate\Support\Facades\Auth;

class PersonsCreatePersonController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected CreatePersonAction $createPersonAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(CreatePersonRequest $request): array
    {
        $personData = $request->validated();
        $personData['user_id'] = Auth::id();
        $person = $this->createPersonAction->handle($personData);

        return [
            'success' => isset($person->id),
            'person' => $person,
        ];
    }
}

/*


fetch("http://local.bizo.bg/persons/create", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
    profile: {
        personal_identification_number: "1234567890",
        personal_identification_number_type_id: 1,
        first_name: "Пешо",
        last_name: "Малкия",
        address: {
            district_id: 3,
            municipality_id: 3,
            town_id: 3,
            postal_code: "3333",
            address: "УЛИЦАТА",
        }
    },
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});


*/
