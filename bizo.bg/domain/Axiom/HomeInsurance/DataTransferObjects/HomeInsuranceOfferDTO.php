<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class HomeInsuranceOfferDTO extends Data
{
    /*
        {
            "productDiscounts" => array:1 [
                0 => array:3 [
                "discountId" => 5
                "discount" => 15
                "discountAmount" => 25.95
                ]
            ]
            "propertyPackages" => array:2 [
                0 => array:5 [
                "propertyPackageId" => 2
                "amount" => 8.0
                "tariff" => 0.08
                "isRealEstate" => true
                "insuranceAmount" => 10000
                ]
                1 => array:5 [
                "propertyPackageId" => 5
                "amount" => 165.0
                "tariff" => 0.3
                "isRealEstate" => false
                "insuranceAmount" => 55000
                ]
            ]
            "installments" => array:1 [
                0 => array:6 [
                "number" => 1
                "amountCurrency" => 147.05
                "amount" => 147.05
                "tax" => 2.941
                "totalAmount" => 149.991
                "dueDate" => "2025-05-31"
                ]
            ]
            "baseTariffCurrency" => 173.0
            "baseTariff" => 173.0
            "amountCurrency" => 147.05
            "amount" => 147.05
            "tax" => 2.941
            "totalAmount" => 149.991
            "currencyCode" => "BGN"
            "currencyRate" => 1.0
            "id" => 900
        }
    */
    public function __construct(
        #[DataCollectionOf(HomeInsuranceInstallmentDTO::class)]
        public Collection $installments,
        public string $currency,
        public float $currency_rate,
        public float $amount,
        public float $tax,
        public float $total_amount,
        public float $base_tariff,
        #[DataCollectionOf(HomeInsuranceDiscountDTO::class)]
        public Collection $discounts,
        #[DataCollectionOf(HomeInsurancePackageDTO::class)]
        public Collection $packages,
        public int $id,
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
        $data['base_tariff'] = $data['base_tariff'] ?? $data['baseTariff'] ?? 0;
        $data['amount'] = $data['amount'] ?? $data['amountCurrency'] ?? 0;

        return new self(
            installments: collect(HomeInsuranceInstallmentDTO::collect($data['installments'])),
            currency: $data['currency'],
            discounts: collect(HomeInsuranceDiscountDTO::collect($data['discounts'])),
            packages: collect(HomeInsurancePackageDTO::collect($data['packages'])),
            currency_rate: $data['currency_rate'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
            base_tariff: $data['base_tariff'],
            id: $data['id'],
        );
    }
}
