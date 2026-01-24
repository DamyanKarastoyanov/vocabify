<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class NonResidentInsurancePolicyDTO extends Data
{
    /*
        "insuranceAmount" => 60000
        "agentExternalCode" => "154_ИТАЛИЯ"
        "installments" => array:1 [
        0 => array:8 [
            "policyId" => 0
            "id" => 0
            "number" => 1
            "amountCurrency" => 0
            "amount" => 147.06
            "tax" => 2.94
            "totalAmount" => 150.0
            "dueDate" => "2025-07-24"
        ]
        ]
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
        "mainCoverages" => []
        "customers" => array:1 [
        0 => array:24 [
            "policyId" => 302
            "id" => 1
            "townType" => ""
            "townName" => "СОФИЯ"
            "customerTypeId" => 1
            "pinType" => "EGN"
            "pin" => "8805305860"
            "firstName" => "John"
            "middleName" => null
            "lastName" => "Doe"
            "latinFullName" => "John Doe"
            "townId" => 4091
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
        "insurer" => array:24 [
        "policyId" => 302
        "id" => 1
        "townType" => ""
        "townName" => "СОФИЯ"
        "customerTypeId" => 1
        "pinType" => "EGN"
        "pin" => "8805305860"
        "firstName" => "John"
        "middleName" => null
        "lastName" => "Doe"
        "latinFullName" => "John Doe"
        "townId" => 4091
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
        "productDiscounts" => []
        "axiomOfferId" => 1093
        "revision" => 1
        "insuranceTypeId" => 202
        "contractTypeId" => 0
        "policyStatusId" => 1
        "policyStatusName" => "Активна"
        "isActive" => false
        "offerNum" => "526"
        "policyNum" => "252020012"
        "referenceNum" => ""
        "policyDate" => "2025-07-09"
        "beginDate" => "2025-07-24"
        "endDate" => "2026-07-23"
        "period" => 0
        "agentId" => 22
        "insuredPersonFirstName" => null
        "insuredPersonMiddleName" => null
        "insuredPersonLastName" => null
        "insuredPersonLocation" => null
        "insuredPersonAddress" => null
        "insuredPersonPin" => null
        "insuredPersonPinType" => null
        "insurerPersonFirstName" => null
        "insurerPersonMiddleName" => null
        "insurerPersonLastName" => null
        "insurerPersonLocation" => null
        "insurerPersonAddress" => null
        "insurerPersonPin" => null
        "insurerPersonPinType" => null
        "agentName" => "ДЕЛТА ИНС БРОКЕР ООД"
        "agentTypeId" => 3
        "agentTypeName" => ""
        "officeId" => 11114
        "officeName" => ""
        "officeRegionId" => 15
        "officeRegionName" => ""
        "agentIsPayer" => 0
        "numberOfInstallments" => 1
        "commonProductCode" => ""
        "currencyCode" => "BGN"
        "currencyRate" => 1.0
        "objectsCount" => 0
        "amount" => 147.06
        "tax" => 2.94
        "totalAmount" => 150.0
        "synced" => false
        "id" => 302
        "createdDate" => "2025-07-09"
        "createdByUserId" => null
        "createdByName" => "ДЕЛТА ИНС ИНТЕГРАЦИЯ"
        "updatedDate" => "2025-07-09"
        "updatedByUserId" => null
        "updatedByName" => null
    */
    public function __construct(
        #[DataCollectionOf(NonResidentInsuranceInstallmentDTO::class)]
        public Collection $installments,
        #[DataCollectionOf(NonResidentInsuranceCustomerGroupDTO::class)]
        public Collection $customer_groups,
        // #[DataCollectionOf(NonResidentInsuranceDiscountDTO::class)]
        // public Collection $discounts,
        public string $currency,
        public float $currency_rate,
        public float $amount,
        public float $tax,
        public float $total_amount,
        public int $id,
        public int $policy_number,
        public int $policy_status_id,
        public string $start_date,
        public string $end_date,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['customer_groups'] = $data['customerGroups'] ?? $data['customer_groups'] ?? [];
        //$data['discounts'] = $data['discounts'] ?? $data['productDiscounts'] ?? [];
        $data['additional_coverages'] = $data['additionalCoverages'] ?? $data['additional_coverages'] ?? [];
        $data['total_amount'] = $data['total_amount'] ?? $data['totalAmount'] ?? 0;
        $data['currency'] = $data['currency'] ?? $data['currencyCode'] ?? 'BGN';
        $data['currency_rate'] = $data['currency_rate'] ?? $data['currencyRate'] ?? 1;
        $data['policy_number'] = $data['policy_number'] ?? $data['policyNum'] ?? 0;
        $data['policy_status_id'] = $data['policyStatusId'] ?? $data['policy_status_id'] ?? 1;
        $data['start_date'] = $data['beginDate'] ?? $data['start_date'] ?? '';
        $data['end_date'] = $data['endDate'] ?? $data['end_date'] ?? '';

        return new self(
            installments: collect(NonResidentInsuranceInstallmentDTO::collect($data['installments'])),
            customer_groups: collect(NonResidentInsuranceCustomerGroupDTO::collect($data['customer_groups'])),
            //discounts: collect(NonResidentInsuranceDiscountDTO::collect($data['discounts'])),
            currency: $data['currency'],
            currency_rate: $data['currency_rate'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
            id: $data['id'],
            policy_number: $data['policy_number'],
            policy_status_id: $data['policy_status_id'],
            start_date: $data['start_date'],
            end_date: $data['end_date'],
        );
    }
}
