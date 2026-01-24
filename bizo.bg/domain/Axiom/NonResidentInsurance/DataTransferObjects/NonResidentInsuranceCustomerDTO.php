<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class NonResidentInsuranceCustomerDTO extends Data
{
    /*
        {
            "customerId": 1,
            "pinType": "EGN",
            "pin": "8805305860",
            "firstName": "Петър",
            "lastName": "Великов",
            "latinFullName": "PETAR VELIKOV",
            "customerGroupId": 1,
            "postCode": "2770",
            "townId": 27,
            "municipalityId": 12,
            "districtId": 1,
            "countryId": 6,
            "address": "ул. Първа 1",
            "hasForeignPhoneNumber": true,
            "isMobilePhoneBulgarian": false
        }
    */
    public function __construct(
        public int $customerId,
        public string $firstName,
        public string $lastName,
        public string $latinFullName,
        public string $pin,
        public string $pinType,
        public int $customerGroupId,
        public string $postCode,
        public int $townId,
        public int $municipalityId,
        public int $districtId,
        public int $countryId,
        public string $address,
        public string $mobilePhone,
        public bool $hasForeignPhoneNumber = false,
        public bool $isMobilePhoneBulgarian = true,
        public ?string $birthDate = null,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['customerId'] = $data['customer_id'] ?? $data['customerId'] ?? null;
        $data['firstName'] = $data['first_name'] ?? $data['firstName'] ?? null;
        $data['lastName'] = $data['last_name'] ?? $data['lastName'] ?? null;
        $data['latinFullName'] = $data['latin_full_name'] ?? $data['latinFullName'] ?? null;
        $data['pin'] = $data['personal_identification_number'] ?? $data['pin'] ?? null;
        $data['pinType'] = $data['personal_identification_number_type'] ?? $data['pinType'] ?? null;
        $data['customerGroupId'] = $data['customer_group_id'] ?? $data['customerGroupId'] ?? null;
        $data['postCode'] = $data['post_code'] ?? $data['postCode'] ?? '';
        $data['townId'] = $data['town_id'] ?? $data['townId'] ?? 0;
        $data['municipalityId'] = $data['municipality_id'] ?? $data['municipalityId'] ?? 0;
        $data['districtId'] = $data['district_id'] ?? $data['districtId'] ?? 0;
        $data['countryId'] = $data['country_id'] ?? $data['countryId'] ?? 0;
        $data['address'] = $data['address'] ?? '';
        $data['mobilePhone'] = $data['mobile_phone'] ?? $data['mobilePhone'] ?? '';
        $data['hasForeignPhoneNumber'] = $data['has_foreign_phone_number'] ?? $data['hasForeignPhoneNumber'] ?? false;
        $data['isMobilePhoneBulgarian'] = $data['is_mobile_phone_bulgarian'] ?? $data['isMobilePhoneBulgarian'] ?? true;
        $data['birthDate'] = $data['birth_date'] ?? $data['birthDate'] ?? null;

        return new self(
            customerId: $data['customerId'],
            firstName: $data['firstName'],
            lastName: $data['lastName'],
            latinFullName: $data['latinFullName'],
            pin: $data['pin'],
            pinType: $data['pinType'],
            customerGroupId: $data['customerGroupId'],
            postCode: $data['postCode'],
            townId: $data['townId'],
            municipalityId: $data['municipalityId'],
            districtId: $data['districtId'],
            countryId: $data['countryId'],
            address: $data['address'],
            mobilePhone: $data['mobilePhone'],
            hasForeignPhoneNumber: $data['hasForeignPhoneNumber'],
            isMobilePhoneBulgarian: $data['isMobilePhoneBulgarian'],
            birthDate: $data['birthDate'],
        );
    }
}
