<?php

namespace App\Http\Web\MVRFinesCheck\Queries;

use Illuminate\Http\Request;

class MVRFinesCheckSelectedValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    public function get(): array
    {
        return [
            'profile' => null,
            'egn' => null,
            'driving_licence_number' => null,
        ];
    }
}

