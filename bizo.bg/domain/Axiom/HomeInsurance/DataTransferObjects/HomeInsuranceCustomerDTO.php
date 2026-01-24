<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Domain\Axiom\Global\Models\AxiomCustomerType;
use Spatie\LaravelData\Data;

class HomeInsuranceCustomerDTO extends Data
{
    /*
        {
            "address": "Test",
            "firstName": "Test",
            "pin": "8805305860",
            "pinType": "EGN",
            "postCode": "9000",
            "townId": "538",
            "customerTypeId": "2",
            "middleName": "Test",
            "lastName": "Test",
            "phoneNumber": "0899999999",
            "mobilePhone": "0899999999",
            "email": null,
            "bankId": null
        }
    */
    public function __construct(
        public string $address,
        public string $first_name,
        public string $personal_identification_number,
        public string $personal_identification_number_type,
        public string $post_code,
        public int $town_id,
        public int $customer_type_id = 2,
        public ?string $middle_name = null,
        public ?string $last_name = null,
        public ?string $phone_number,
        public string $mobile_phone,
        public ?string $email = null,
        public ?int $bank_id = null,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['first_name'] = $data['first_name'] ?? $data['firstName'] ?? null;
        $data['last_name'] = $data['last_name'] ?? $data['lastName'] ?? null;
        $data['phone_number'] = $data['phone_number'] ?? $data['phoneNumber'] ?? null;
        $data['mobile_phone'] = $data['mobile_phone'] ?? $data['mobilePhone'] ?? null;
        $data['personal_identification_number'] = $data['personal_identification_number'] ?? $data['pin'] ?? null;
        $data['personal_identification_number_type'] = $data['personal_identification_number_type'] ?? $data['pinType'] ?? null;
        $data['post_code'] = $data['post_code'] ?? $data['postCode'] ?? null;
        $data['town_id'] = isset($data['town_id']) || isset($data['townId']) ? (int)($data['town_id'] ?? $data['townId']) : null;
        $data['customer_type_id'] = isset($data['customer_type_id']) || isset($data['customerTypeId']) ? (int)($data['customer_type_id'] ?? $data['customerTypeId']) : AxiomCustomerType::MAIN_CUSTOMER_TYPE_ID;
        $data['middle_name'] = $data['middle_name'] ?? $data['middleName'] ?? null;
        $data['bank_id'] = isset($data['bank_id']) || isset($data['bankId']) ? (int)($data['bank_id'] ?? $data['bankId']) : null;

        return new self(
            address: $data['address'] ?? null,
            first_name: $data['first_name'],
            personal_identification_number: $data['personal_identification_number'],
            personal_identification_number_type: $data['personal_identification_number_type'],
            post_code: $data['post_code'],
            town_id: $data['town_id'],
            customer_type_id: $data['customer_type_id'],
            middle_name: $data['middle_name'],
            last_name: $data['last_name'],
            phone_number: $data['phone_number'],
            mobile_phone: $data['mobile_phone'],
            email: $data['email'] ?? null,
            bank_id: $data['bank_id'],
        );
    }
}
