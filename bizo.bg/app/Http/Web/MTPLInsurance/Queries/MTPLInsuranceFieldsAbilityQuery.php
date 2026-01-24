<?php

namespace App\Http\Web\MTPLInsurance\Queries;

use Illuminate\Http\Request;

class MTPLInsuranceFieldsAbilityQuery
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
            'model_name' => false,
            'mark_name' => false,
            'vin' => false,
        ];
    }
}
