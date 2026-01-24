<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdatePersonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $person = $this->route('person');

        return Auth::user()->can('edit', $person);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'profile.personal_identification_number_type_id' => 'sometimes|numeric',
            'profile.personal_identification_number' => 'sometimes|max:20',
            'profile.first_name' => 'sometimes|max:50',
            'profile.last_name' => 'sometimes|max:50',
            'profile.phone' => 'sometimes|nullable|max:20',
        ];

        if (isset(request()->profile['address_id'])) {
            $rules['profile.address_id'] = 'required|exists:addresses,id';
        } else {
            $rules['profile.address.district_id'] = 'required|exists:axiom_districts,id';
            $rules['profile.address.municipality_id'] = 'required|exists:axiom_municipalities,id';
            $rules['profile.address.town_id'] = 'required|exists:axiom_towns,id';
            $rules['profile.address.postal_code'] = 'required|max:10';
            $rules['profile.address.address'] = 'required|max:255';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'profile.personal_identification_number_type_id.required' => 'The personal identification number type is required.',
            'profile.personal_identification_number_type_id.numeric' => 'The personal identification number type must be a number.',
            'profile.personal_identification_number.required' => 'The personal identification number is required.',
            'profile.personal_identification_number.max' => 'The personal identification number must not exceed 20 characters.',
            'profile.first_name.required' => 'The first name is required.',
            'profile.first_name.max' => 'The first name must not exceed 50 characters.',
            'profile.last_name.required' => 'The last name is required.',
            'profile.last_name.max' => 'The last name must not exceed 50 characters.',

            'profile.address_id.required' => 'The address is required.',
            'profile.address_id.exists' => 'The selected address is invalid.',

            'profile.address.district_id.required' => 'The district is required.',
            'profile.address.district_id.exists' => 'The selected district is invalid.',

            'profile.address.municipality_id.required' => 'The municipality is required.',
            'profile.address.municipality_id.exists' => 'The selected municipality is invalid.',

            'profile.address.town_id.required' => 'The town is required.',
            'profile.address.town_id.exists' => 'The selected town is invalid.',

            'profile.address.postal_code.required' => 'The postal code is required.',
            'profile.address.postal_code.max' => 'The postal code must not exceed 10 characters.',

            'profile.address.address.required' => 'The address is required.',
            'profile.address.address.max' => 'The address must not exceed 255 characters.',
        ];
    }
}
