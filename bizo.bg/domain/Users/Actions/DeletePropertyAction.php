<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Property;

class DeletePropertyAction
{
    public function handle(Property $property): void
    {
        $property->delete();
    }
}
