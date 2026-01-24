<?php

namespace App\Http\Web\Persons\Controllers;

use Domain\Users\Actions\DeletePersonAction;
use Domain\Users\Models\Person;
use Domain\Users\Requests\DeletePersonRequest;

class PersonsDeletePersonController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected DeletePersonAction $deletePersonAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(DeletePersonRequest $request, Person $person): array
    {
        $result = $this->deletePersonAction->handle($person);

        return [
            'success' => true,
        ];
    }
}
