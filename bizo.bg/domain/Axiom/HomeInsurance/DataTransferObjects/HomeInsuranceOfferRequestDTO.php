<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class HomeInsuranceOfferRequestDTO extends Data
{
    /*
        {
            "agentId": 22,
            "beginDate": "2025-05-31T21:00:00.000Z",
            "insuranceTypeId": 805,
            "numberOfInstallments": 1,
            "period": 12,
            "property": {
                "address": "Test",
                "postCode": "9000",
                "townId": "538",
                "propertySize": "80"
            },
            "officeRegionId": "15",
            "officeId": "11114",
            "currencyCode": "BGN",
            "productDiscounts": [],
            "customers": [
                {
                "address": "Test",
                "firstName": "Test",
                "pin": "8805305860",
                "pinType": "EGN",
                "postCode": "9000",
                "townId": "538",
                "customerTypeId": "2",
                "middleName": "Test",
                "lastName": "Test",
                "phoneNumber": "0899999999",
                "mobilePhone": "0899999999",
                "email": null
                }
            ],
            "propertyPackages": [
                {
                "propertyPackageId": "2",
                "insuranceAmount": "5000"
                },
                {
                "propertyPackageId": "5",
                "insuranceAmount": "5000"
                }
            ]
        }
    */
    public function __construct(
        // public int $agent_id = 22,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d H:i:s')]
        public Carbon $start_date,
        // public int $insurance_type_id = 805,
        public int $installment,
        public int $period,
        // public string $office_region_id = 15,
        // public string $office_id = 11114,
        public string $currency,
        public HomeInsurancePropertyDTO $property,
        #[DataCollectionOf(HomeInsuranceCustomerDTO::class)]
        public Collection $customers,
        #[DataCollectionOf(HomeInsuranceDiscountDTO::class)]
        public Collection $discounts,
        #[DataCollectionOf(HomeInsurancePackageDTO::class)]
        public Collection $packages,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        return new self(
            start_date: Carbon::parse($data['start_date']),
            installment: $data['installment'],
            period: $data['period'],
            currency: $data['currency'],
            property: HomeInsurancePropertyDTO::from($data['property']),
            customers: collect(HomeInsuranceCustomerDTO::collect($data['customers'])),
            discounts: collect(HomeInsuranceDiscountDTO::collect($data['discounts'])),
            packages: collect(HomeInsurancePackageDTO::collect($data['packages'])),
        );
    }
}
