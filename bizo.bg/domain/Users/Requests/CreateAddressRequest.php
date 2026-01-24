<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'district_id' => 'required|exists:axiom_districts,id',
            'municipality_id' => 'required|exists:axiom_municipalities,id',
            'town_id' => 'required|exists:axiom_towns,id',
            'postal_code' => 'required|max:10',
            'address' => 'required|max:255',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'district_id.required' => 'The district is required.',
            'district_id.exists' => 'The selected district is invalid.',
            'municipality_id.required' => 'The municipality is required.',
            'municipality_id.exists' => 'The selected municipality is invalid.',
            'town_id.required' => 'The town is required.',
            'town_id.exists' => 'The selected town is invalid.',
            'postal_code.required' => 'The postal code is required.',
            'postal_code.max' => 'The postal code must not exceed 10 characters.',
            'address.required' => 'The address is required.',
            'address.max' => 'The address must not exceed 255 characters.',
        ];
    }
}
