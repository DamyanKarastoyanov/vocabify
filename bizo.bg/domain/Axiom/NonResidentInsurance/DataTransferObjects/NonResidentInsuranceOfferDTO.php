<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class NonResidentInsuranceOfferDTO extends Data
{
    /*
        "insuranceAmount" => 0
        "installments" => array:1 [
        0 => array:6 [
            "number" => 1
            "amountCurrency" => 0
            "amount" => 147.06
            "tax" => 2.94
            "totalAmount" => 150.0
            "dueDate" => "2025-07-24"
        ]
        ]
        "mainCoverages" => []
        "customerGroups" => array:1 [
        0 => array:9 [
            "customerGroupId" => 1
            "customerGroupName" => ""
            "count" => 1
            "tariff" => 147.06
            "tariffInBGN" => 147.06
            "tariffPerPerson" => 147.06
            "tariffPerPersonInBGN" => 147.06
            "productCode" => ""
            "insuredCustomers" => array:1 [
            0 => array:27 [
                "customerId" => 1
                "customerGroupId" => 1
                "customerGroupName" => ""
                "pinType" => "EGN"
                "pin" => "8805305860"
                "firstName" => "John"
                "middleName" => null
                "lastName" => "Doe"
                "latinFullName" => "John Doe"
                "birthDate" => "1988-05-30"
                "townType" => "гр."
                "townName" => "СОФИЯ"
                "townId" => 4091
                "municipalityId" => 220
                "municipalityName" => "СТОЛИЧНА"
                "districtId" => 22
                "districtName" => "СОФИЯ-ГРАД"
                "address" => "123 Main St"
                "postCode" => "1000"
                "phone" => null
                "isMobilePhoneBulgarian" => false
                "mobilePhone" => null
                "email" => null
                "yearsOld" => 37
                "countryId" => 4
                "parentPinType" => null
                "parentPIN" => null
            ]
            ]
        ]
        ]
        "customers" => array:1 [
        0 => array:23 [
            "offerId" => 1090
            "id" => 1
            "customerTypeId" => 1
            "pinType" => "EGN"
            "pin" => "8805305860"
            "firstName" => "John"
            "middleName" => null
            "lastName" => "Doe"
            "latinFullName" => "John Doe"
            "townId" => 4091
            "townName" => "СОФИЯ"
            "townPostCode" => "1000"
            "districtId" => 22
            "districtName" => ""
            "municipalityId" => 220
            "address" => "123 Main St"
            "phoneNumber" => ""
            "mobilePhone" => "+359883314542"
            "email" => ""
            "postCode" => "1000"
            "bankId" => null
            "birthDate" => null
            "fullName" => "John Doe"
        ]
        ]
        "productDiscounts" => []
        "insurer" => array:23 [
        "offerId" => 1090
        "id" => 1
        "customerTypeId" => 1
        "pinType" => "EGN"
        "pin" => "8805305860"
        "firstName" => "John"
        "middleName" => null
        "lastName" => "Doe"
        "latinFullName" => "John Doe"
        "townId" => 4091
        "townName" => "СОФИЯ"
        "townPostCode" => "1000"
        "districtId" => 22
        "districtName" => ""
        "municipalityId" => 220
        "address" => "123 Main St"
        "phoneNumber" => ""
        "mobilePhone" => "+359883314542"
        "email" => ""
        "postCode" => "1000"
        "bankId" => null
        "birthDate" => null
        "fullName" => "John Doe"
        ]
        "revision" => 1
        "insuranceTypeId" => 202
        "insuranceTypeCode" => ""
        "insuranceProductCode" => ""
        "contractTypeId" => 0
        "offerNum" => "523"
        "policyNum" => ""
        "referenceNum" => ""
        "policyDate" => "2025-07-09"
        "beginDate" => "2025-07-24"
        "endDate" => "2026-07-23"
        "period" => 12
        "agentId" => 22
        "agentExternalCode" => "154_ИТАЛИЯ"
        "agentTypeId" => 3
        "officeRegionId" => 15
        "officeId" => 11114
        "agentIsPayer" => 0
        "numberOfInstallments" => 1
        "commonProductCode" => ""
        "currencyCode" => "BGN"
        "currencyRate" => 1.0
        "objectsCount" => 0
        "amountCurrency" => 0
        "amount" => 147.06
        "tax" => 2.94
        "totalAmount" => 150.0
        "isActive" => false
        "offerStatus" => 2
        "synced" => true
        "id" => 1090
        "createdDate" => "2025-07-09"
        "createdByUserId" => null
        "createdByName" => "ДЕЛТА ИНС ИНТЕГРАЦИЯ"
        "updatedDate" => "2025-07-09"
        "updatedByUserId" => null
        "updatedByName" => null
    */
    public function __construct(
        // #[DataCollectionOf(NonResidentInsuranceDiscountDTO::class)]
        // public Collection $discounts,
        #[DataCollectionOf(NonResidentInsuranceCustomerGroupDTO::class)]
        public Collection $customer_groups,
        #[DataCollectionOf(NonResidentInsuranceInstallmentDTO::class)]
        public Collection $installments,
        public NonResidentInsuranceInsurerDTO $insurer,
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
        $data['insurer'] = $data['insurer'] ?? $data['insurer'] ?? [];

        return new self(
            //discounts: collect(TravelInsuranceDiscountDTO::collect($data['discounts'])),
            customer_groups: collect(NonResidentInsuranceCustomerGroupDTO::collect($data['customer_groups'])),
            installments: collect(NonResidentInsuranceInstallmentDTO::collect($data['installments'])),
            currency: $data['currency'],
            currency_rate: $data['currency_rate'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
            id: $data['id'],
            insurer: NonResidentInsuranceInsurerDTO::fromArray($data['insurer']),
        );
    }
}
