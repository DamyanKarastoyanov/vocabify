<?php

namespace Domain\Axiom\TravelInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class TravelInsuranceOfferRequestDTO extends Data
{
    /*
        {
            "officeRegionId": 15,
            "officeId": 11114,
            "agentId": 22,
            "insuranceTypeId": 209,
            "beginDate": "2025-06-24T21:00:00.000Z",
            "endDate": "2026-06-23T21:00:00.000Z",
            "currencyCode": "EUR",
            "travelTypeId": 1,
            "travelTypeActivityId": null,
            "isMultiTravel": false,
            "maxDaysPerTravel": 0,
            "numberOfInstallments": 1,
            "territorialCoverageId": 1,
            "customerGroups": [
                {
                    "travelCustomerGroupId": 1,
                    "insuranceAmount": 10000,
                    "insuredCustomers": [
                        {
                            "customerId": 1,
                            "pinType": "EGN",
                            "pin": "8805305860",
                            "firstName": "Петър",
                            "middleName": null,
                            "lastName": "Великов",
                            "latinFullName": "PETAR VELIKOV",
                            "birthDate": null,
                            "travelCustomerGroupId": 1,
                            "districtId": null,
                            "address": null,
                            "phoneNumber": null,
                            "mobilePhone": null,
                            "email": null,
                            "postCode": null,
                            "parentPinType": null,
                            "parentPIN": null,
                            "isStudent": false,
                            "isMultiTravel": false
                        }
                    ]
                }
            ],
            "productDiscounts": [],
            "additionalCoverages": [],
            "insurer": {
                "customerTypeId": 1,
                "pinType": "EGN",
                "pin": "8805305860",
                "firstName": "Петър",
                "middleName": null,
                "lastName": "Великов",
                "districtId": 2,
                "municipalityId": 37,
                "townId": 281,
                "address": "ААА да",
                "phoneNumber": null,
                "mobilePhone": "+359 883314542",
                "email": null,
                "postCode": "8000",
                "id": -1,
                "validToggler": null
            }
        }
    */
    public function __construct(
        public int $officeRegionId,
        public int $officeId,
        public int $agentId,
        public int $insuranceTypeId,
        public string $beginDate,
        public string $endDate,
        public string $currencyCode,
        public int $travelTypeId,
        public ?int $travelTypeActivityId = null,
        public bool $isMultiTravel = false,
        public int $maxDaysPerTravel = 0,
        public int $numberOfInstallments,
        public int $territorialCoverageId,
        #[DataCollectionOf(TravelInsuranceDiscountDTO::class)]
        public Collection $productDiscounts,
        #[DataCollectionOf(TravelInsuranceCustomerGroupDTO::class)]
        public Collection $customerGroups,
        #[DataCollectionOf(TravelInsuranceAdditionalCoverageDTO::class)]
        public Collection $additionalCoverages,
        public TravelInsuranceInsurerDTO $insurer,
    ) {
        //
    }
}
