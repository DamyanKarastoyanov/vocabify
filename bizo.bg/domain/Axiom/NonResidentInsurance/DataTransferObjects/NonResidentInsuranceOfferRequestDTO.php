<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class NonResidentInsuranceOfferRequestDTO extends Data
{
    /*
        {
            "officeRegionId": 15,
            "officeId": 11114,
            "agentId": 22,
            "insuranceTypeId": 202,
            "beginDate": "2025-07-09T21:00:00.000Z",
            "period": 12,
            "currencyCode": "BGN",
            "numberOfInstallments": 1,
            "insuranceAmount": 0, - MAY OR MAY NOT BE NEEDED - TO BE SEEN
            "productDiscounts": [],
            "customerGroups": [
                {
                    "customerGroupId": 1,
                    "count": 2,
                    "insuredCustomers": [
                        {
                            "customerId": 1,
                            "pinType": "EGN",
                            "pin": "8805305860",
                            "firstName": "Владимир",
                            "middleName": null,
                            "lastName": "Димов",
                            "latinFullName": "VLADIMIR DIMOV",
                            "birthDate": null,
                            "customerGroupId": 1,
                            "districtId": 1,
                            "municipalityId": 12,
                            "townId": 27,
                            "address": "сдсдфсдф",
                            "hasForeignPhoneNumber": false,
                            "mobilePhone": "0883314542",
                            "email": null,
                            "postCode": "2770",
                            "parentPinType": "EGN",
                            "parentPIN": null,
                            "countryId": 6,
                            "isMobilePhoneBulgarian": true
                        }
                    ]
                }
            ],
            "insurer": {
                "customerTypeId": 1,
                "pinType": "EGN",
                "pin": "8805305860",
                "firstName": "Владимир",
                "middleName": null,
                "lastName": "Димов",
                "districtId": 3,
                "latinFullName": "VLADIMIR DIMOV",
                "birthDate": null,
                "municipalityId": 41,
                "townId": 538,
                "address": "asdasdasd",
                "phoneNumber": null,
                "mobilePhone": "0883314542",
                "email": null,
                "postCode": "9000",
                "id": -1
            }
        }
    */
    public function __construct(
        public int $officeRegionId,
        public int $officeId,
        public int $agentId,
        public int $insuranceTypeId,
        public string $beginDate,
        public int $period,
        public string $currencyCode,
        public int $numberOfInstallments,
        // #[DataCollectionOf(TravelInsuranceDiscountDTO::class)]
        // public Collection $productDiscounts,
        #[DataCollectionOf(NonResidentInsuranceCustomerGroupDTO::class)]
        public Collection $customerGroups,
        public NonResidentInsuranceInsurerDTO $insurer,
    ) {
        //
    }
}
