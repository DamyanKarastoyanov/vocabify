<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class HomeInsuranceInstallmentDTO extends Data
{
    /*
        {
            "number": 1,
            "amountCurrency": 147.05,
            "amount": 147.05,
            "tax": 2.941,
            "totalAmount": 149.991,
            "dueDate": "2025-05-16"
        }
    */
    public function __construct(
        public int $number,
        public float $amount_currency,
        public float $amount,
        public float $tax,
        public float $total_amount,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d H:i:s')]
        public Carbon $due_date,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['number'] = $data['number'] ?? $data['number'];
        $data['amount_currency'] = $data['amount_currency'] ?? $data['amountCurrency'];
        $data['total_amount'] = $data['total_amount'] ?? $data['totalAmount'];
        $data['due_date'] = Carbon::parse($data['due_date'] ?? $data['dueDate']);

        return new self(
            number: $data['number'],
            amount_currency: $data['amount_currency'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
            due_date: $data['due_date'],
        );
    }
}
