<?php

namespace App\Http\Web\VehicleInspection\Queries;

use Illuminate\Http\Request;

class VehicleInspectionSelectedValuesQuery
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

            'registration_number' => null,
            'captcha_code' => null,
        ];
    }
}

