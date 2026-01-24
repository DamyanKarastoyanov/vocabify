<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsuranceOfferPaymentDTO extends Data
{
    /*
        {
            "number": 4,
            "total": "94.80",
            "total_bgn": "94.80",
            "total_eur": "48.47"
        }
    */
    public function __construct(
        public int $number,
        public string $total,
        public string $total_bgn,
        public string $total_eur
    ) {
        //
    }
}
