<?php

namespace Domain\Axiom\TravelInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class TravelInsurancePriceCalculationRequestDTO extends Data
{
    /*
       {
            "insuranceTypeId": 209,
            "customerGroups": [
                {
                    "travelCustomerGroupId": 1,
                    "count": 1,
                    "countUnder14": 0,
                    "countUnder18": 0,
                    "countUnder26": 0,
                    "insuranceAmount": 10000
                }
            ],
            "productDiscounts": [],
            "additionalCoverages": [
                {
                    "additionalCoverageId": 1,
                    "name": "Смърт вследствие злополука",
                    "selected": true,
                    "insuranceAmount": 4000
                }
            ],
            "numberOfInstallments": 1,
            "beginDate": "2025-06-23T21:00:00.000Z",
            "endDate": "2025-06-24T21:00:00.000Z",
            "currencyCode": "EUR",
            "isMultiTravel": false,
            "maxDaysPerTravel": 0,
            "travelTypeId": 2,
            "travelTypeActivityId": 4,
            "territorialCoverageId": 1
        }
    */
    public function __construct(
        public int $insuranceTypeId,
        public string $currencyCode,
        public int $numberOfInstallments,
        public string $beginDate,
        public string $endDate,
        public bool $isMultiTravel = false,
        public int $maxDaysPerTravel = 0,
        public int $travelTypeId,
        public ?int $travelTypeActivityId,
        public int $territorialCoverageId,
        #[DataCollectionOf(TravelInsuranceDiscountDTO::class)]
        public Collection $productDiscounts,
        #[DataCollectionOf(TravelInsuranceCustomerGroupDTO::class)]
        public Collection $customerGroups,
        #[DataCollectionOf(TravelInsuranceAdditionalCoverageDTO::class)]
        public Collection $additionalCoverages,
    ) {
        //
    }
}
