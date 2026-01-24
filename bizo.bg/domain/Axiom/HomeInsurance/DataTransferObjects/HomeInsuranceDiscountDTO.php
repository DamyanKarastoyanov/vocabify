<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class HomeInsuranceDiscountDTO extends Data
{
    /*
        {
            "discountId": 5,
            "discount": 15
        }
    */
    public function __construct(
        public int $discount_id,
        public float $discount,
        public ?float $discount_amount,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['discount_id'] = $data['discount_id'] ?? $data['discountId'];
        $data['discount_amount'] = $data['discount_amount'] ?? $data['discountAmount'] ?? null;

        return new self(
            discount_id: $data['discount_id'],
            discount: $data['discount'],
            discount_amount: $data['discount_amount'],
        );
    }
}
