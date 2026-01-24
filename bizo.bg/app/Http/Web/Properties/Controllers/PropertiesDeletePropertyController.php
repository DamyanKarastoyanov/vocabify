<?php

namespace App\Http\Web\Properties\Controllers;

use Domain\Users\Actions\DeletePropertyAction;
use Domain\Users\Models\Property;
use Domain\Users\Requests\DeletePropertyRequest;

class PropertiesDeletePropertyController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected DeletePropertyAction $deletePropertyAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(DeletePropertyRequest $request, Property $property): array
    {
        $this->deletePropertyAction->handle($property);

        return [
            'success' => true,
        ];
    }
}
