<?php

namespace App\Http\Web\VignetteCheck\Queries;

use Illuminate\Http\Request;

class VignetteCheckFieldsAbilityQuery
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
            'vehicle' => true,
            'registration_number' => true
        ];
    }
}

