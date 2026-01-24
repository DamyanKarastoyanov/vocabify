<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Property;

class UpdatePropertyAction
{
    public function __construct(
        protected CreateAddressAction $createAddressAction,
        protected UpdateAddressAction $updateAddressAction
    ) {
        //
    }

    public function handle(Property $property, array $propertyData): Property
    {
        if (isset($propertyData['address'])) {
            if (!$property->address_id) {
                $address = $this->createAddressAction->handle($propertyData['address']);
                $propertyData['address_id'] = $address->id ?? null;
            } else {
                $address = $this->updateAddressAction->handle($property->address, $propertyData['address']);
                $propertyData['address_id'] = $address->id ?? null;
            }
        }

        $property->update($propertyData);

        return $property;
    }
}
