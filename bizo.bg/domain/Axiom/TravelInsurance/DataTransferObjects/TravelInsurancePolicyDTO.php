<?php

namespace Domain\Axiom\TravelInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class TravelInsurancePolicyDTO extends Data
{
    /*
        "territorialCoverageId": 3,
        "territorialCoverageName": "Цял свят",
        "travelTypeId": 1,
        "travelTypeName": "Туризъм",
        "travelTypeActivityId": null,
        "travelTypeActivityName": "",
        "isMultiTravel": true,
        "maxDaysPerTravelId": 1,
        "maxDaysPerTravel": 30,
        "period": 365,
        "agentExternalCode": "154_ИТАЛИЯ",
        "installments": [
            {
                "policyId": 257,
                "id": 1,
                "number": 1,
                "amountCurrency": 0,
                "amount": 51.54,
                "tax": 1.03,
                "totalAmount": 52.57,
                "dueDate": "2025-05-08"
            }
        ],
        "customerGroups": [
            {
                "travelCustomerGroupId": 3,
                "travelCustomerGroupName": "Лица от 18 до 65 год. възраст",
                "count": 1,
                "countUnder18": 0,
                "countUnder26": 0,
                "insuranceAmount": 10000.00,
                "tariff": 31.00,
                "reducedTariff": 0,
                "tariffInBGN": 60.6307300,
                "reducedTariffInBGN": 0,
                "tariffPerPerson": 31.00,
                "reducedTariffPerPerson": 0,
                "tariffPerPersonInBGN": 60.6307300,
                "reducedTariffPerPersonInBGN": 0,
                "insuredCustomers": [
                    {
                        "policyId": 257,
                        "travelCustomerGroupId": 3,
                        "travelCustomerGroupName": "Лица от 18 до 65 год. възраст",
                        "customerId": 1,
                        "pinType": "EGN",
                        "pin": "9101020531",
                        "firstName": "тест",
                        "middleName": "тест",
                        "lastName": "тест",
                        "latinFullName": "TEST TEST TEST",
                        "birthDate": "1991-01-02",
                        "townType": "Град",
                        "townName": "ВАРНА",
                        "townId": 538,
                        "municipalityId": 41,
                        "districtId": 3,
                        "address": "тест",
                        "postCode": "9000",
                        "phone": null,
                        "mobilePhone": null,
                        "email": null,
                        "yearsOld": 34,
                        "insuranceAmount": 10000.00,
                        "tariff": 31.00,
                        "reducedTariff": 0.00,
                        "isStudent": false,
                        "parentPinType": null,
                        "parentPIN": null
                    }
                ]
            }
        ],
        "productDiscounts": [
            {
                "discountId": 5,
                "discount": 15.00,
                "discountAmount": 4.65
            }
        ],
        "additionalCoverages": [],
        "customers": [
            {
                "policyId": 257,
                "id": 1,
                "townType": "",
                "townName": "ВАРНА",
                "customerTypeId": 1,
                "pinType": "EGN",
                "pin": "9004010467",
                "firstName": "тес",
                "middleName": "тес",
                "lastName": "тес",
                "latinFullName": "",
                "townId": 538,
                "townPostCode": "9000",
                "districtId": 3,
                "districtName": "",
                "municipalityId": 41,
                "address": "тест",
                "phoneNumber": null,
                "mobilePhone": null,
                "email": null,
                "postCode": "9000",
                "bankId": null,
                "birthDate": null,
                "fullName": "тес тес тес"
            }
        ],
        "insurer": {
            "policyId": 257,
            "id": 1,
            "townType": "",
            "townName": "ВАРНА",
            "customerTypeId": 1,
            "pinType": "EGN",
            "pin": "9004010467",
            "firstName": "тес",
            "middleName": "тес",
            "lastName": "тес",
            "latinFullName": "",
            "townId": 538,
            "townPostCode": "9000",
            "districtId": 3,
            "districtName": "",
            "municipalityId": 41,
            "address": "тест",
            "phoneNumber": null,
            "mobilePhone": null,
            "email": null,
            "postCode": "9000",
            "bankId": null,
            "birthDate": null,
            "fullName": "тес тес тес"
        },
        "axiomOfferId": 881,
        "revision": 1,
        "insuranceTypeId": 209,
        "contractTypeId": 0,
        "policyStatusId": 1,
        "policyStatusName": "Активна",
        "isActive": false,
        "offerNum": "414",
        "policyNum": "252090008",
        "referenceNum": "",
        "policyDate": "2025-05-07",
        "beginDate": "2025-05-08",
        "endDate": "2026-05-07",
        "agentId": 22,
        "insuredPersonFirstName": null,
        "insuredPersonMiddleName": null,
        "insuredPersonLastName": null,
        "insuredPersonLocation": null,
        "insuredPersonAddress": null,
        "insuredPersonPin": null,
        "insuredPersonPinType": null,
        "insurerPersonFirstName": null,
        "insurerPersonMiddleName": null,
        "insurerPersonLastName": null,
        "insurerPersonLocation": null,
        "insurerPersonAddress": null,
        "insurerPersonPin": null,
        "insurerPersonPinType": null,
        "agentName": "ДЕЛТА ИНС БРОКЕР ООД",
        "agentTypeId": 3,
        "agentTypeName": "",
        "officeId": 11114,
        "officeName": "",
        "officeRegionId": 15,
        "officeRegionName": "",
        "agentIsPayer": 0,
        "numberOfInstallments": 1,
        "commonProductCode": "",
        "currencyCode": "EUR",
        "currencyRate": 1.95583,
        "objectsCount": 0,
        "amount": 51.54,
        "tax": 1.03,
        "totalAmount": 52.57,
        "synced": false,
        "id": 257,
        "createdDate": "2025-05-07",
        "createdByUserId": null,
        "createdByName": "ДЕЛТА ИНС ИНТЕГРАЦИЯ",
        "updatedDate": "2025-06-24",
        "updatedByUserId": null,
        "updatedByName": null
    */
    public function __construct(
        public int $territorial_coverage_id,
        public int $travel_type_id,
        public int $travel_type_activity_id,
        public bool $is_multi_travel = false,
        public int $period,
        #[DataCollectionOf(TravelInsuranceInstallmentDTO::class)]
        public Collection $installments,
        #[DataCollectionOf(TravelInsuranceCustomerGroupDTO::class)]
        public Collection $customer_groups,
        #[DataCollectionOf(TravelInsuranceDiscountDTO::class)]
        public Collection $discounts,
        #[DataCollectionOf(TravelInsuranceAdditionalCoverageDTO::class)]
        public Collection $additional_coverages,
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
        $data['territorial_coverage_id'] = $data['territorialCoverageId'] ?? $data['territorial_coverage_id'] ?? 0;
        $data['travel_type_id'] = $data['travelTypeId'] ?? $data['travel_type_id'] ?? 0;
        $data['travel_type_activity_id'] = $data['travelTypeActivityId'] ?? $data['travel_type_activity_id'] ?? 0;
        $data['is_multi_travel'] = $data['isMultiTravel'] ?? $data['is_multi_travel'] ?? false;
        $data['customer_groups'] = $data['customerGroups'] ?? $data['customer_groups'] ?? [];
        $data['discounts'] = $data['discounts'] ?? $data['productDiscounts'] ?? [];
        $data['additional_coverages'] = $data['additionalCoverages'] ?? $data['additional_coverages'] ?? [];
        $data['total_amount'] = $data['total_amount'] ?? $data['totalAmount'] ?? 0;
        $data['currency'] = $data['currency'] ?? $data['currencyCode'] ?? 'BGN';
        $data['currency_rate'] = $data['currency_rate'] ?? $data['currencyRate'] ?? 1;
        $data['policy_number'] = $data['policy_number'] ?? $data['policyNum'] ?? 0;
        $data['policy_status_id'] = $data['policyStatusId'] ?? $data['policy_status_id'] ?? 1;
        $data['start_date'] = $data['beginDate'] ?? $data['start_date'] ?? '';
        $data['end_date'] = $data['endDate'] ?? $data['end_date'] ?? '';

        return new self(
            territorial_coverage_id: $data['territorial_coverage_id'],
            travel_type_id: $data['travel_type_id'],
            travel_type_activity_id: $data['travel_type_activity_id'],
            is_multi_travel: $data['is_multi_travel'],
            period: $data['period'],
            installments: collect(TravelInsuranceInstallmentDTO::collect($data['installments'])),
            customer_groups: collect(TravelInsuranceCustomerGroupDTO::collect($data['customer_groups'])),
            discounts: collect(TravelInsuranceDiscountDTO::collect($data['discounts'])),
            additional_coverages: collect(TravelInsuranceAdditionalCoverageDTO::collect($data['additional_coverages'])),
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
