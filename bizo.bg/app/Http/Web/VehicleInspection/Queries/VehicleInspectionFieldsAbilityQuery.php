<?php

namespace App\Http\Web\VehicleInspection\Queries;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VehicleInspectionFieldsAbilityQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    /**
     * Get the field ability states.
     * Returns an array where keys are field names and values are boolean indicating if the field is enabled.
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

