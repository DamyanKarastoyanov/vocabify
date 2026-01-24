<?php

namespace App\Http\Web\VignetteCheck\Queries;

use Illuminate\Http\Request;

class VignetteCheckSelectedValuesQuery
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
            'vehicle' => null,
            'registration_number' => null
        ];
    }
}

