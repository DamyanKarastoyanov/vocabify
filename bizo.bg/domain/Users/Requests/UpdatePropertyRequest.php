<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $property = $this->route('property');

        return Auth::user()->can('edit', $property);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'gross_floor_area_m2' => 'sometimes|numeric',
        ];

        if (request()->address_id) {
            $rules['address_id'] = 'required|exists:addresses,id';
        } else {
            $rules['address.district_id'] = 'required|exists:axiom_districts,id';
            $rules['address.municipality_id'] = 'required|exists:axiom_municipalities,id';
            $rules['address.town_id'] = 'required|exists:axiom_towns,id';
            $rules['address.postal_code'] = 'required|max:10';
            $rules['address.address'] = 'required|max:255';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'gross_floor_area_m2.required' => 'The gross floor area is required.',
            'gross_floor_area_m2.number' => 'The gross floor area must be a number.',

            'address_id.required' => 'The address is required.',
            'address_id.exists' => 'The selected address is invalid.',

            'address.district_id.required' => 'The district is required.',
            'address.district_id.exists' => 'The selected district is invalid.',

            'address.municipality_id.required' => 'The municipality is required.',
            'address.municipality_id.exists' => 'The selected municipality is invalid.',

            'address.town_id.required' => 'The town is required.',
            'address.town_id.exists' => 'The selected town is invalid.',

            'address.postal_code.required' => 'The postal code is required.',
            'address.postal_code.max' => 'The postal code must not exceed 10 characters.',

            'address.address.required' => 'The address is required.',
            'address.address.max' => 'The address must not exceed 255 characters.',
        ];
    }
}
