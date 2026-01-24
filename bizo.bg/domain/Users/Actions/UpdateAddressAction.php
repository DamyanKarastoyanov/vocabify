<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Address;

class UpdateAddressAction
{
    public function handle(Address $address, array $addressData): Address
    {
        $address->update($addressData);
        return $address;
    }
}
