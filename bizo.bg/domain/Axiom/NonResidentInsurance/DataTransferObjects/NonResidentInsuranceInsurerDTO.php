<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Domain\Axiom\Global\Models\AxiomCustomerType;
use Spatie\LaravelData\Data;

class NonResidentInsuranceInsurerDTO extends Data
{
    /*
        {
            "customerTypeId": 1,
            "pinType": "EGN",
            "pin": "**********",
            "firstName": "Владимир",
            "lastName": "Димов",
            "districtId": 3,
            "latinFullName": "VLADIMIR DIMOV",
            "municipalityId": 41,
            "townId": 538,
            "address": "asdasdasd",
            "mobilePhone": "0883314542",
            "postCode": "9000",
            "id": -1  // - maybe not needed
        }
    */
    public function __construct(
        public int $customerTypeId,
        public string $pin,
        public string $pinType,
        public string $firstName,
        public string $lastName,
        public string $latinFullName,
        public int $districtId,
        public int $municipalityId,
        public int $townId,
        public string $address,
        public string $mobilePhone,
        public string $postCode,
        public string $email,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['customerTypeId'] = $data['customer_type_id'] = isset($data['customer_type_id']) || isset($data['customerTypeId']) ? (int)($data['customer_type_id'] ?? $data['customerTypeId']) : AxiomCustomerType::INSURER_CUSTOMER_TYPE_ID;
        $data['firstName'] = $data['first_name'] ?? $data['firstName'] ?? null;
        $data['lastName'] = $data['last_name'] ?? $data['lastName'] ?? null;
        $data['latinFullName'] = $data['latin_full_name'] ?? $data['latinFullName'] ?? null;
        $data['pin'] = $data['personal_identification_number'] ?? $data['pin'] ?? null;
        $data['pinType'] = $data['personal_identification_number_type'] ?? $data['pinType'] ?? null;
        $data['districtId'] = $data['district_id'] ?? $data['districtId'] ?? null;
        $data['municipalityId'] = $data['municipality_id'] ?? $data['municipalityId'] ?? null;
        $data['townId'] = $data['town_id'] ?? $data['townId'] ?? null;
        $data['address'] = $data['address'] ?? '';
        $data['mobilePhone'] = $data['mobile_phone'] ?? $data['mobilePhone'] ?? '';
        $data['postCode'] = $data['post_code'] ?? $data['postCode'] ?? '';
        $data['email'] = $data['email'] ?? '';

        return new self(
            customerTypeId: $data['customerTypeId'],
            firstName: $data['firstName'],
            lastName: $data['lastName'],
            latinFullName: $data['latinFullName'] ?? '',
            pin: $data['pin'],
            pinType: $data['pinType'],
            districtId: $data['districtId'],
            municipalityId: $data['municipalityId'],
            townId: $data['townId'],
            address: $data['address'],
            mobilePhone: $data['mobilePhone'],
            postCode: $data['postCode'],
            email: $data['email'],
        );
    }
}
