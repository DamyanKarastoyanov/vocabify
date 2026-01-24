<?php

namespace App\Http\Web\HomeInsurance\Queries;

use Illuminate\Http\Request;

class HomeInsuranceFieldsAbilityQuery
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
            'currency' => false,
        ];
    }
} 