<?php

namespace Domain\Axiom\TravelInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class TravelInsuranceOfferDTO extends Data
{
    /*
        "customerGroups" => array:1 [
            0 => array:15 [
            "travelCustomerGroupId" => 1
            "travelCustomerGroupName" => "Лица от 0 до 70 год. възраст"
            "count" => 1
            "countUnder14" => 0
            "countUnder18" => 0
            "countUnder26" => 0
            "insuranceAmount" => 10000
            "tariff" => 1.2
            "tariffInBGN" => 2.346996
            "reducedTariff" => 0
            "reducedTariffInBGN" => 0.0
            "tariffPerPerson" => 1.0
            "tariffPerPersonInBGN" => 1.95583
            "reducedTariffPerPerson" => 0
            "reducedTariffPerPersonInBGN" => 0.0
            ]
        ]
        "additionalCoverages" => array:1 [
            0 => array:11 [
            "additionalCoverageId" => 1
            "additionalCoverageName" => "Смърт вследствие злополука"
            "insuranceAmount" => 4000
            "tariff" => 0.192
            "tariffInBGN" => 0.38
            "reducedTariff" => 0
            "reducedTariffInBGN" => 0.0
            "tariffPerPerson" => 0.16
            "tariffPerPersonInBGN" => 0.31
            "reducedTariffPerPerson" => 0
            "reducedTariffPerPersonInBGN" => 0.0
            ]
        ]
        "installments" => array:1 [
            0 => array:6 [
            "number" => 1
            "amountCurrency" => 3.0
            "amount" => 5.86749
            "tax" => 0.1173498
            "totalAmount" => 5.9848398
            "dueDate" => "2025-06-24"
            ]
        ]
        "productDiscounts" => []
        "currencyCode" => "EUR"
        "currencyRate" => 1.95583
        "tariff" => 3.0
        "tariffInBGN" => 5.86749
        "amount" => 5.86749
        "surcharge" => 20.0
        "surchargeAmount" => 0
        "discount" => 0
        "discountAmount" => 0
        "tax" => 0.11735
        "totalAmount" => 5.98484
        "messageId" => "87748a94-c209-4ec6-8cff-bc436d82f400"
        "success" => true
        "errors" => []
        "id" => "1067"
    */
    public function __construct(
        #[DataCollectionOf(TravelInsuranceDiscountDTO::class)]
        public Collection $discounts,
        #[DataCollectionOf(TravelInsuranceCustomerGroupDTO::class)]
        public Collection $customer_groups,
        #[DataCollectionOf(TravelInsuranceAdditionalCoverageDTO::class)]
        public Collection $additional_coverages,
        #[DataCollectionOf(TravelInsuranceInstallmentDTO::class)]
        public Collection $installments,
        public string $currency,
        public float $currency_rate,
        public float $amount,
        public float $tax,
        public float $total_amount,
        public int $id,
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
            discounts: collect(TravelInsuranceDiscountDTO::collect($data['discounts'])),
            customer_groups: collect(TravelInsuranceCustomerGroupDTO::collect($data['customer_groups'])),
            additional_coverages: collect(TravelInsuranceAdditionalCoverageDTO::collect($data['additional_coverages'])),
            installments: collect(TravelInsuranceInstallmentDTO::collect($data['installments'])),
            currency: $data['currency'],
            currency_rate: $data['currency_rate'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
            id: $data['id'],
        );
    }
}
