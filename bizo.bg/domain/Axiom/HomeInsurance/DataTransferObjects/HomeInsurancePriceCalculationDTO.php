<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class HomeInsurancePriceCalculationDTO extends Data
{
    /*
       {
            "productDiscounts": [
                {
                "discountId": 5,
                "discount": 15,
                "discountAmount": 25.95
                }
            ],
            "propertyPackages": [
                {
                "propertyPackageId": 2,
                "amount": 8,
                "tariff": 0.08,
                "isRealEstate": true,
                "insuranceAmount": 10000
                },
                {
                "propertyPackageId": 5,
                "amount": 165,
                "tariff": 0.3,
                "isRealEstate": false,
                "insuranceAmount": 55000
                }
            ],
            "installments": [
                {
                "number": 1,
                "amountCurrency": 147.05,
                "amount": 147.05,
                "tax": 2.941,
                "totalAmount": 149.991,
                "dueDate": "2025-05-16"
                }
            ],
            "currencyCode": "BGN",
            "currencyRate": 1,
            "amount": 147.05,
            "tax": 2.941,
            "totalAmount": 149.991,
            "hash": "539E90A41998DCF2E1FD1D3D802561B56B4331EA2C6CBD6766DC454E9C9B35",
            "messageId": "c9d990ae-65d1-4571-82fc-c71ddc1ae2c1",
            "success": true,
            "errors": []
            }
    */
    public function __construct(
        #[DataCollectionOf(HomeInsuranceDiscountDTO::class)]
        public Collection $discounts,
        #[DataCollectionOf(HomeInsurancePackageDTO::class)]
        public Collection $packages,
        #[DataCollectionOf(HomeInsuranceInstallmentDTO::class)]
        public Collection $installments,
        public string $currency,
        public float $currency_rate,
        public float $amount,
        public float $tax,
        public float $total_amount,
        public string $hash,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['packages'] = $data['packages'] ?? $data['productPackages'] ?? [];
        $data['discounts'] = $data['discounts'] ?? $data['productDiscounts'] ?? [];
        $data['total_amount'] = $data['total_amount'] ?? $data['totalAmount'] ?? 0;
        $data['currency'] = $data['currency'] ?? $data['currencyCode'] ?? 'BGN';
        $data['currency_rate'] = $data['currency_rate'] ?? $data['currencyRate'] ?? 1;

        return new self(
            discounts: collect(HomeInsuranceDiscountDTO::collect($data['discounts'])),
            packages: collect(HomeInsurancePackageDTO::collect($data['packages'])),
            installments: collect(HomeInsuranceInstallmentDTO::collect($data['installments'])),
            currency: $data['currency'],
            currency_rate: $data['currency_rate'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
            hash: $data['hash'],
        );
    }
}
