<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Address;

class CreateAddressAction
{
    public function handle(array $addressData): Address
    {
        $address = Address::updateOrCreate(
            [
                'district_id' => $addressData['district_id'] ?? null,
                'municipality_id' => $addressData['municipality_id'] ?? null,
                'town_id' => $addressData['town_id'] ?? null,
                'postal_code' => $addressData['postal_code'] ?? null,
                'address' => $addressData['address'] ?? null,
            ],
            $addressData
        );

        return $address;
    }
}
