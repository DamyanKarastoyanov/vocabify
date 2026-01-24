<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Carbon\Carbon;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class HomeInsurancePolicyDTO extends Data
{
    /*
        [
            "id" => 256
            "axiomOfferId" => 880
            "revision" => 1
            "insuranceTypeId" => 805
            "contractTypeId" => 0
            "policyStatusId" => 1
            "policyStatusName" => "Активна"
            "isActive" => false
            "offerNum" => "413"
            "policyNum" => "258050031"
            "referenceNum" => ""
            "policyDate" => "2025-05-07"
            "beginDate" => "2025-05-08"
            "endDate" => "2026-05-07"
            "period" => 0
            "agentId" => 22
            "insuredPersonFirstName" => "тест "
            "insuredPersonMiddleName" => null
            "insuredPersonLastName" => null
            "insuredPersonLocation" => "ВАРНА"
            "insuredPersonAddress" => "тест"
            "insuredPersonPin" => "9101020531"
            "insuredPersonPinType" => "EGN"
            "insurerPersonFirstName" => "тест "
            "insurerPersonMiddleName" => null
            "insurerPersonLastName" => "тест"
            "insurerPersonLocation" => "ВАРНА"
            "insurerPersonAddress" => "тест"
            "insurerPersonPin" => "9101020531"
            "insurerPersonPinType" => "EGN"
            "agentName" => "ДЕЛТА ИНС БРОКЕР ООД"
            "agentExternalCode" => ""
            "agentTypeId" => 3
            "agentTypeName" => ""
            "officeId" => 11114
            "officeName" => "СОФИЯ"
            "officeRegionId" => 15
            "officeRegionName" => "ЦУ - ДЕЛТА ИНС БРОКЕР"
            "agentIsPayer" => 0
            "numberOfInstallments" => 1
            "commonProductCode" => ""
            "currencyCode" => "BGN"
            "currencyRate" => 1.0
            "objectsCount" => 0
            "amount" => 19.0
            "tax" => 0.38
            "totalAmount" => 19.38
            "synced" => false
            "personalPropertyInsuranceAmount" => 5000.0
            "personalPropertyPackageName" => "Стандарт"
            "propertyInsuranceAmount" => 5000.0
            "propertyPackageName" => "Стандарт"
            "createdDate" => "2025-05-07"
            "createdByUserId" => null
            "createdByName" => "ДЕЛТА ИНС ИНТЕГРАЦИЯ"
            "updatedDate" => "2025-05-19"
            "updatedByUserId" => null
            "updatedByName" => null
            "customers" => array:1 [
            0 => array:24 [
                "policyId" => 256
                "id" => 0
                "townType" => "гр."
                "townName" => "ВАРНА"
                "customerTypeId" => 2
                "pinType" => "EGN"
                "pin" => "9101020531"
                "firstName" => "тест "
                "middleName" => null
                "lastName" => "тест"
                "latinFullName" => ""
                "townId" => 538
                "townPostCode" => ""
                "districtId" => 3
                "districtName" => ""
                "municipalityId" => 41
                "address" => "тест"
                "phoneNumber" => null
                "mobilePhone" => "0899999999"
                "email" => null
                "postCode" => "9000"
                "bankId" => null
                "birthDate" => null
                "fullName" => "тест  тест"
            ]
            ]
            "installments" => array:1 [
            0 => array:8 [
                "policyId" => 256
                "id" => 0
                "number" => 1
                "amountCurrency" => 0
                "amount" => 19.0
                "tax" => 0.38
                "totalAmount" => 19.38
                "dueDate" => "2025-05-08"
            ]
            ]
            "packageObjects" => array:2 [
            0 => array:8 [
                "policyId" => 256
                "id" => 0
                "amount" => 4.0
                "tariff" => 0.08
                "isRealEstate" => true
                "insuranceAmount" => 5000.0
                "propertyPackageId" => 2
                "propertyPackageName" => "Стандарт"
            ]
            1 => array:8 [
                "policyId" => 256
                "id" => 0
                "amount" => 15.0
                "tariff" => 0.3
                "isRealEstate" => false
                "insuranceAmount" => 5000.0
                "propertyPackageId" => 5
                "propertyPackageName" => "Стандарт"
            ]
            ]
            "propertyObject" => array:10 [
            "id" => 170
            "axiomOfferId" => 256
            "postCode" => "9000"
            "townId" => 538
            "townName" => "ВАРНА"
            "townType" => "гр."
            "districtId" => 3
            "municipalityId" => 41
            "address" => "Тест"
            "propertySize" => 80.0
            ]
            "productDiscounts" => []
        ]
    */
    public function __construct(
        #[DataCollectionOf(HomeInsuranceInstallmentDTO::class)]
        public Collection $installments,
        public string $currency,
        public float $currency_rate,
        public float $amount,
        public float $tax,
        public float $total_amount,
        #[DataCollectionOf(HomeInsuranceDiscountDTO::class)]
        public Collection $discounts,
        #[DataCollectionOf(HomeInsurancePackageDTO::class)]
        public Collection $packages,
        public int $id,
        public AxiomPolicyStatus $status,
        public int $policy_number,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d H:i:s')]
        public Carbon $start_date,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d H:i:s')]
        public Carbon $end_date,
        #[WithCast(DateTimeInterfaceCast::class, 'Y-m-d H:i:s')]
        public Carbon $policy_date,
        public HomeInsurancePropertyDTO $property,
        #[DataCollectionOf(HomeInsuranceCustomerDTO::class)]
        public Collection $customers,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['packages'] = $data['packages'] ?? $data['packageObjects'] ?? [];
        $data['discounts'] = $data['discounts'] ?? $data['productDiscounts'] ?? [];
        $data['total_amount'] = $data['total_amount'] ?? $data['totalAmount'] ?? 0;
        $data['currency'] = $data['currency'] ?? $data['currencyCode'] ?? 'BGN';
        $data['currency_rate'] = $data['currency_rate'] ?? $data['currencyRate'] ?? 1;
        $data['base_tariff'] = $data['base_tariff'] ?? $data['baseTariff'] ?? 0;
        $data['amount'] = $data['amount'] ?? $data['amountCurrency'] ?? 0;
        $data['status_id'] = $data['status_id'] ?? $data['policyStatusId'] ?? 0;
        $data['policy_number'] = $data['policy_number'] ?? $data['policyNum'] ?? 0;
        $data['start_date'] = $data['start_date'] ?? $data['beginDate'];
        $data['end_date'] = $data['end_date'] ?? $data['endDate'];
        $data['policy_date'] = $data['policy_date'] ?? $data['policyDate'];
        $data['property'] = $data['property'] ?? $data['propertyObject'] ?? [];

        return new self(
            installments: collect(HomeInsuranceInstallmentDTO::collect($data['installments'])),
            currency: $data['currency'],
            discounts: collect(HomeInsuranceDiscountDTO::collect($data['discounts'])),
            packages: collect(HomeInsurancePackageDTO::collect($data['packages'])),
            currency_rate: $data['currency_rate'],
            amount: $data['amount'],
            tax: $data['tax'],
            total_amount: $data['total_amount'],
            id: $data['id'],
            status: AxiomPolicyStatus::where('axiom_id', $data['status_id'])
                ->first(),
            policy_number: $data['policy_number'],
            start_date: Carbon::parse($data['start_date']),
            end_date: Carbon::parse($data['end_date']),
            policy_date: Carbon::parse($data['policy_date']),
            property: HomeInsurancePropertyDTO::from($data['property']),
            customers: collect(HomeInsuranceCustomerDTO::collect($data['customers'])),
        );
    }
}
