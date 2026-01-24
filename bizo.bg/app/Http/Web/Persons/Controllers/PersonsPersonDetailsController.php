<?php

namespace App\Http\Web\Persons\Controllers;

use App\Http\Web\Persons\Queries\PersonDetailsQuery;
use App\Http\Web\Persons\Resources\PersonDetailsResource;
use Domain\Users\Models\Person;
use Domain\Users\Requests\GetPersonDetailsRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonsPersonDetailsController
{
    public function __invoke(GetPersonDetailsRequest $request, ?Person $person): JsonResource
    {
        return PersonDetailsResource::make((new PersonDetailsQuery($request, $person))->get());
    }
}
