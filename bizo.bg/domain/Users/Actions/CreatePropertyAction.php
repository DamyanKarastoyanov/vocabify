<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Property;

class CreatePropertyAction
{
    public function __construct(
        protected CreateAddressAction $createAddressAction
    ) {
        //
    }

    public function handle(array $propertyData): Property
    {
        if (!isset($propertyData['address_id'])) {
            $address = $this->createAddressAction->handle($propertyData['address'] ?? []);
            $propertyData['address_id'] = $address->id ?? null;
        }

        $property = Property::updateOrCreate(
            [
                'address_id' => $propertyData['address_id'] ?? null,
                'user_id' => $propertyData['user_id'] ?? null,
            ],
            $propertyData
        );

        return $property;
    }
}
