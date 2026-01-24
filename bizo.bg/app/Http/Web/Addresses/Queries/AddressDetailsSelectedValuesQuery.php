<?php

namespace App\Http\Web\Addresses\Queries;

use Domain\Users\Models\Address;
use Illuminate\Http\Request;

class AddressDetailsSelectedValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Address $address,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        return [
            'district' => $this->address->district ? [
                'value' => $this->address->district->id,
                'label' => $this->address->district->name,
            ] : [],
            'municipality' => $this->address->municipality ? [
                'value' => $this->address->municipality->id,
                'label' => $this->address->municipality->name,
            ] : [],
            'town' => $this->address->town ? [
                'value' => $this->address->town->id,
                'label' => $this->address->town->name,
            ] : [],
            'postcode' => $this->address->postal_code ?? '',
            'address' => $this->address->address ?? '',
        ];
    }
}
