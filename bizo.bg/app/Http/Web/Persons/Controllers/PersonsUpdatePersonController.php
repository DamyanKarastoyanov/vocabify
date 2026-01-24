<?php

namespace App\Http\Web\Persons\Controllers;

use Domain\Users\Actions\UpdatePersonAction;
use Domain\Users\Models\Person;
use Domain\Users\Requests\UpdatePersonRequest;

class PersonsUpdatePersonController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected UpdatePersonAction $updatePersonAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Person $person, UpdatePersonRequest $request): array
    {
        $personData = $request->validated();
        $person = $this->updatePersonAction->handle($person, $personData);

        return [
            'success' => isset($person->id),
            'person' => $person,
        ];
    }
}

/*


fetch("http://local.bizo.bg/persons/6/update", {
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
      personal_identification_number_type_id: 1,
      personal_identification_number: "1234567895",
      first_name: "Пешо",
      last_name: "Малкия",
      address: {
        district_id: 3,
        municipality_id: 3,
        town_id: 3,
        postal_code: "3333",
        address: "УЛИЦАТА В СЯНКА",
      }
    }
  }),
  method: "PUT",
  mode: "cors",
  credentials: "include"
});


*/
