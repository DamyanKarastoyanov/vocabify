<?php

namespace Domain\Axiom\TravelInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class TravelInsuranceCustomerDTO extends Data
{
    /*
        {
            "customerId": 1,
            "pinType": "EGN",
            "pin": "8805305860",
            "firstName": "Петър",
            "lastName": "Великов",
            "latinFullName": "PETAR VELIKOV",
            "travelCustomerGroupId": 1,
            "isStudent": false,
            "birthDate": "1988-05-29T20:00:00.000Z"
        }
    */
    public function __construct(
        public int $customerId,
        public string $firstName,
        public string $lastName,
        public string $latinFullName,
        public string $pin,
        public string $pinType,
        public int $travelCustomerGroupId,
        public bool $isStudent = false,
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
        $data['travelCustomerGroupId'] = $data['travel_customer_group_id'] ?? $data['travelCustomerGroupId'] ?? null;
        $data['isStudent'] = $data['is_student'] ?? $data['isStudent'] ?? false;
        $data['birthDate'] = $data['birth_date'] ?? $data['birthDate'] ?? null;

        return new self(
            customerId: $data['customerId'],
            firstName: $data['firstName'],
            lastName: $data['lastName'],
            latinFullName: $data['latinFullName'],
            pin: $data['pin'],
            pinType: $data['pinType'],
            travelCustomerGroupId: $data['travelCustomerGroupId'],
            isStudent: $data['isStudent'],
            birthDate: $data['birthDate'],
        );
    }
}
