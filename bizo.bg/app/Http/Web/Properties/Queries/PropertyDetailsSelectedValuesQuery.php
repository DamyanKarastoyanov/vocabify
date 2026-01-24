<?php

namespace App\Http\Web\Properties\Queries;

use Domain\Users\Models\Property;
use Illuminate\Http\Request;

class PropertyDetailsSelectedValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Property $property,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $this->property->load(
            'address',
        );

        return [
            'property_size' => $this->property->gross_floor_area_m2,
            'district' => $this->property->address ? [
                'value' => $this->property->address->district->id,
                'label' => $this->property->address->district->name,
            ] : [],
            'municipality' => $this->property->address ? [
                'value' => $this->property->address->municipality->id,
                'label' => $this->property->address->municipality->name,
            ] : [],
            'town' => $this->property->address ? [
                'value' => $this->property->address->town->id,
                'label' => $this->property->address->town->name,
            ] : [],
            'postcode' => $this->property->address ? $this->property->address->postal_code : '',
            'address' => $this->property->address ? $this->property->address->address : '',
        ];
    }
}
