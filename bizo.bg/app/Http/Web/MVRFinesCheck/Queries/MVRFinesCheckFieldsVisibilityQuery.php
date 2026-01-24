<?php

namespace App\Http\Web\MVRFinesCheck\Queries;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MVRFinesCheckFieldsVisibilityQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        return [
            'profile' => Auth::check() ? true : false,
            'egn' => true,
            'driving_licence_number' => true,
        ];
    }
}

