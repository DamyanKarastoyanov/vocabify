<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Address;

class DeleteAddressAction
{
    public function handle(Address $address): void
    {
        $address->delete();
    }
}
