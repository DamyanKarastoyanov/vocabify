<?php

namespace App\Http\Web\Persons\Controllers;

use App\Http\Web\Persons\Queries\PersonsQuery;
use App\Http\Web\Persons\Resources\PersonsResource;
use Illuminate\Http\Request;
use Inertia\Response;

class PersonsController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
    ): Response {
        return inertia('persons/persons', [
            'persons' => fn() => PersonsResource::make((new PersonsQuery($request))->getPaginated()),
        ]);
    }
}
