<?php

namespace App\Http\Web\MTPLCheck\Queries;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MtplCheckFieldsVisibilityQuery
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
            'vehicle' => Auth::check() ? true : false,
            'registration_number' => true,
        ];
    }
}

