<?php

namespace Domain\Axiom\Global\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class AxiomDiscountDTO extends Data
{
      /*
        [▼
            "insuranceTypeId" => 805
            "id" => 5
            "discount" => 15.0
            "maxDiscount" => 15.0
            "step" => 15.0
            "description" => "Отстъпка Великден 2024"
            "beginDate" => "2023-01-07"
            "endDate" => null
            "isActive" => true
            "isAutoApplicable" => false
        ]
       */
    public function __construct(
        //public int $insuranceTypeId,
        public int $id,
        public float $discount,
        public float $maxDiscount,
        public float $step,
        public string $description,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d')]
        public Carbon $beginDate,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d')]
        public ?Carbon $endDate,
        public bool $isActive,
        public bool $isAutoApplicable,
    ) {
        //
    }
}
