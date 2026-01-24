<?php

namespace App\Http\Web\VehicleInspection\Queries;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VehicleInspectionFieldsVisibilityQuery
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
                'captcha_code' => true,
        ];
    }
}

