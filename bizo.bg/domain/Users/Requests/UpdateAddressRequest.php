<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $address = $this->route('address');

        return Auth::user()->can('edit', $address);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'district_id' => 'sometimes|exists:axiom_districts,id',
            'municipality_id' => 'sometimes|exists:axiom_municipalities,id',
            'town_id' => 'sometimes|exists:axiom_towns,id',
            'postal_code' => 'sometimes|max:10',
            'address' => 'sometimes|max:255',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'district_id.exists' => 'The selected district is invalid.',
            'municipality_id.exists' => 'The selected municipality is invalid.',
            'town_id.exists' => 'The selected town is invalid.',
            'postal_code.max' => 'The postal code must not exceed 10 characters.',
            'address.max' => 'The address must not exceed 255 characters.',
        ];
    }
}
