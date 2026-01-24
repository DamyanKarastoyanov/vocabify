<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class MTPLInsuranceOfferDTO extends Data
{
    /*
        {
            "status": 1,
            "offer": 164230,
            "total": "404.36",
            "total_bgn": "404.36",
            "total_eur": "206.75",
            "payments": {
                "1": {
                    "number": 1,
                    "total": "119.97",
                    "total_bgn": "119.97",
                    "total_eur": "61.34"
                },
                "2": {
                    "number": 2,
                    "total": "94.80",
                    "total_bgn": "94.80",
                    "total_eur": "48.47"
                },
                "3": {
                    "number": 3,
                    "total": "94.80",
                    "total_bgn": "94.80",
                    "total_eur": "48.47"
                },
                "4": {
                    "number": 4,
                    "total": "94.80",
                    "total_bgn": "94.80",
                    "total_eur": "48.47"
                }
            }
        }
    */
    public function __construct(
        public int $status,
        public int $offer,
        public string $total,
        public string $total_bgn,
        public string $total_eur,
        #[DataCollectionOf(MTPLInsuranceOfferPaymentDTO::class)]
        public Collection $payments,
    ) {
        //
    }
}
