<?php

namespace App\Http\Web\NonResidentInsurance\Queries;

use Illuminate\Http\Request;

class NonResidentInsuranceFieldsAbilityQuery
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
            'installment' => false,
            'currency' => false,
        ];
    }
}
