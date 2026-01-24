<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class NonResidentInsurancePriceCalculationRequestDTO extends Data
{
    /*
       {
            "insuranceTypeId": 202,
            "customerGroups": [
                {
                    "customerGroupId": 1,
                    "count": 1
                }
            ],
            "numberOfInstallments": 1,
            "productDiscounts": [],
            "beginDate": "2025-07-16T21:00:00.000Z",
            "period": 12,
            "currencyCode": "BGN"
        }
    */
    public function __construct(
        public int $insuranceTypeId,
        public string $currencyCode,
        public int $numberOfInstallments,
        public string $beginDate,
        public int $period,
        // #[DataCollectionOf(NonResidentInsuranceDiscountDTO::class)]
        // public Collection $productDiscounts,
        #[DataCollectionOf(NonResidentInsuranceCustomerGroupDTO::class)]
        public Collection $customerGroups,
    ) {
        //
    }
}
