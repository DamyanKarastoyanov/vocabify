<?php

namespace Domain\Vehicles\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class MVRFinesObligationDTO extends Data
{
    public function __construct(
        public ?string $document_number = null,
        public ?string $document_type = null,
        public ?Carbon $issue_date = null,
        public bool $is_served = false,
        public ?string $reg_number = null,
        public ?Carbon $violation_date = null,
        public ?string $violation = null,
        public float $amount_bgn = 0,
        public float $discount_bgn = 0,
        public float $amount_to_pay_bgn = 0,
        public float $amount_eur = 0,
        public ?Carbon $valid_until = null,
        public ?Carbon $obligation_date = null,
    ) {}

    public function toPersistenceArray(): array
    {
        return [
            'document_number' => $this->document_number,
            'document_type' => $this->document_type,
            'issue_date' => $this->issue_date?->toDateString(),
            'is_served' => $this->is_served,
            'reg_number' => $this->reg_number,
            'violation_date' => $this->violation_date?->toDateString(),
            'violation' => $this->violation,
            'amount_bgn' => $this->amount_bgn,
            'discount_bgn' => $this->discount_bgn,
            'amount_to_pay_bgn' => $this->amount_to_pay_bgn,
            'amount_eur' => $this->amount_eur,
            'valid_until' => $this->valid_until?->toDateString(),
            'obligation_date' => $this->obligation_date?->toDateString(),
        ];
    }
}

