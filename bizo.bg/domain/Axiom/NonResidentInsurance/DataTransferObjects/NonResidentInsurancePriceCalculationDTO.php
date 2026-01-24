<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class NonResidentInsurancePriceCalculationDTO extends Data
{
    /*
        "insuranceTypeId" => 0
        "currencyCode" => "BGN"
        "currencyRate" => 1.0
        "tariff" => 147.06
        "tariffInBGN" => 147.06
        "amount" => 147.06
        "surcharge" => 0
        "surchargeAmount" => 0
        "discount" => 0
        "discountAmount" => 0
        "tax" => 2.94
        "totalAmount" => 150.0
        "productDiscounts" => []
        "customerGroups" => array:1 [
            0 => array:7 [
            "customerGroupId" => 1
            "customerGroupName" => ""
            "count" => 1
            "tariff" => 147.06
            "tariffInBGN" => 147.06
            "tariffPerPerson" => 147.06
            "tariffPerPersonInBGN" => 147.06
            ]
        ]
        "installments" => array:1 [
            0 => array:6 [
            "number" => 1
            "amountCurrency" => 147.06
            "amount" => 147.06
            "tax" => 2.9412
            "totalAmount" => 150.0012
            "dueDate" => "2025-07-24"
            ]
        ]
        "messageId" => "c8a2bd64-ddeb-4c6c-a867-dcffa8cf5b99"
        "success" => true
        "errors" => []
    */
    public function __construct(
        // #[DataCollectionOf(NonResidentInsuranceDiscountDTO::class)]
        // public Collection $discounts,
        #[DataCollectionOf(NonResidentInsuranceCustomerGroupDTO::class)]
        public Collection $customer_groups,
        #[DataCollectionOf(NonResidentInsuranceInstallmentDTO::class)]
        public Collection $installments,
        public string $currency,
        public float $currency_rate,
        public float $amount,
        public float $tax,
        public float $total_amount,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['customer_groups'] = $data['customerGroups'] ?? $data['customer_groups'] ?? [];
        $data['additional_coverages'] = $data['additionalCoverages'] ?? $data['additional_coverages'] ?? [];
        $data['discounts'] = $data['discounts'] ?? $data['productDiscounts'] ?? [];
        $data['total_amount'] = $data['total_amount'] ?? $data['totalAmount'] ?? 0;
        $data['currency'] = $data['currency'] ?? $data['currencyCode'] ?? 'BGN';
        $data['currency_rate'] = $data['currency_rate'] ?? $data['currencyRate'] ?? 1;

        return new self(
            // discounts: collect(TravelInsuranceDiscountDTO::collect($data['discounts'])),
            customer_groups: collect(NonResidentInsuranceCustomerGroupDTO::collect($data['customer_groups'])),
            installments: collect(NonResidentInsuranceInstallmentDTO::collect($data['installments'])),
            currency: $data['currency'],
            currency_rate: $data['currency_rate'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
        );
    }
}
