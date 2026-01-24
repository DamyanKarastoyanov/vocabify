<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class HomeInsurancePriceCalculationRequestDTO extends Data
{
    /*
       {
            "currencyCode": "BGN",
            "insuranceTypeId": 805,
            "numberOfInstallments": 1,
            "beginDate": "2025-04-26T21:00:00.000Z",
            "period": 12,
            "propertyPackages": [
                {
                "propertyPackageId": 1,
                "insuranceAmount": 5000
                },
                {
                "propertyPackageId": 5,
                "insuranceAmount": 5000
                }
            ],
            "productDiscounts": [
                {
                "discountId": 6,
                "discount": 15
                }
            ]
        }

        public string $currencyCode = 'BGN',
        public int $insuranceTypeId = 805,
        public int $numberOfInstallments = 1,
        public Carbon $beginDate = Carbon::now()->toDateTimeString(),
        public int $period = 12,
        public array $propertyPackages = [],
        public array $productDiscounts = [],
    */
    public function __construct(
        public string $currency,
        public int $insurance_type_id,
        public int $installment,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d H:i:s')]
        public Carbon $start_date,
        public int $period,
        #[DataCollectionOf(HomeInsurancePackageDTO::class)]
        public Collection $packages,
        #[DataCollectionOf(HomeInsuranceDiscountDTO::class)]
        public Collection $discounts,
    ) {
        //
    }
}
