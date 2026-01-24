<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class HomeInsurancePropertyDTO extends Data
{
    /*
        {
            "address": "Test",
            "postCode": "9000",
            "townId": "538",
            "propertySize": "80"
        }
    */
    public function __construct(
        public string $address,
        public string $post_code,
        public int $town_id,
        public int|null $district_id = null,
        public int|null $municipality_id = null,
        public string|null $town_type = null,
        public float $property_size,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['post_code'] = $data['post_code'] ?? $data['postCode'];
        $data['town_id'] = $data['town_id'] ?? $data['townId'];
        $data['district_id'] = $data['district_id'] ?? $data['districtId'] ?? null;
        $data['municipality_id'] = $data['municipality_id'] ?? $data['municipalityId'] ?? null;
        $data['town_type'] = $data['town_type'] ?? $data['townType'] ?? null;
        $data['property_size'] = $data['property_size'] ?? $data['propertySize'];

        return new self(
            address: $data['address'],
            post_code: $data['post_code'],
            town_id: $data['town_id'],
            district_id: $data['district_id'],
            municipality_id: $data['municipality_id'],
            town_type: $data['town_type'],
            property_size: $data['property_size'],
        );
    }
}
