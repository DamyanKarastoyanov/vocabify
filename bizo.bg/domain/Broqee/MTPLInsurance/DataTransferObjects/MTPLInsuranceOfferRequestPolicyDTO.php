<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsuranceOfferRequestPolicyDTO extends Data
{
    /*
       {
            "installments": 4,
            "start_date": "2025-09-10"
        }
    */
    public function __construct(
        public int $installments,
        public string $start_date
    ) {
        //
    }
}
