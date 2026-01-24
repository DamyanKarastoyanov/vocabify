<?php

namespace App\Http\Web\Properties\Controllers;

use App\Http\Web\Properties\Queries\PropertyDetailsQuery;
use App\Http\Web\Properties\Resources\PropertyDetailsResource;
use Domain\Users\Models\Property;
use Domain\Users\Requests\GetPropertyDetailsRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertiesPropertyDetailsController
{
    public function __invoke(GetPropertyDetailsRequest $request, ?Property $property): JsonResource
    {
        return PropertyDetailsResource::make((new PropertyDetailsQuery($request, $property))->get());
    }
}
