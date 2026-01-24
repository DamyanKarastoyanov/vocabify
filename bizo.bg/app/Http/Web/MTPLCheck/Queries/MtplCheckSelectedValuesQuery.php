<?php

namespace App\Http\Web\MTPLCheck\Queries;

use Illuminate\Http\Request;

class MtplCheckSelectedValuesQuery
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
            'registration_number' => null,
        ];
    }
}

