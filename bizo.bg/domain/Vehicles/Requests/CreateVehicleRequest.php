<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateVehicleRequest extends FormRequest
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
            'reg_number' => 'required|string|max:255',
            'talon' => 'nullable|string|max:255',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'reg_number.required' => 'The registration number is required.',
            'reg_number.string' => 'The registration number must be a string.',
            'reg_number.max' => 'The registration number must not exceed 255 characters.',
            'talon.string' => 'The talon must be a string.',
            'talon.max' => 'The talon must not exceed 255 characters.',
            'talon.nullable' => 'The talon may be null.',
        ];
    }
}

