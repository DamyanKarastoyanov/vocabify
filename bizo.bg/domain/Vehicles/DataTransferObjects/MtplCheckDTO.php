<?php

namespace Domain\Vehicles\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class MtplCheckDTO extends Data
{
    /*
        {
            "registrationNumber": "CA5688AA",
            "hasValidInsurance": true,
            "details": [{
                "insurer": "Insurance Company",
                "policyNumber": "POL123456",
                "startDate": "2025-01-01",
                "endDate": "2026-01-01"
            }]
        }
    */
    public function __construct(
        public bool $has_valid_insurance = false,
        public ?string $insurer = null,
        public ?string $policy_number = null,
        public ?Carbon $start_date = null,
        public ?Carbon $end_date = null,
        /** Raw decoded array for auditing */
        public array $raw_response = [],
    ) {
        //
    }

    public function toPersistenceArray(): array
    {
        return [
            'has_valid_insurance' => $this->has_valid_insurance,
            'insurer' => $this->insurer,
            'policy_number' => $this->policy_number,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'raw_response' => $this->raw_response,
        ];
    }
}

