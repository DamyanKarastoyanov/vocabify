<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateVehicleInspectionRequest extends FormRequest
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
            'vehicle_id' => 'required|exists:vehicles,id',
            'next_inspection_date' => 'required|date',
            'is_valid' => 'required|boolean',
            'is_periodic' => 'required|boolean',
            'eco_category' => 'required|string|max:255',
            'raw_response' => 'required|array',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'vehicle_id.required' => 'The vehicle is required.',
            'vehicle_id.exists' => 'The selected vehicle is invalid.',
            'next_inspection_date.required' => 'The next inspection date is required.',
            'next_inspection_date.date' => 'The next inspection date must be a valid date.',
            'is_valid.required' => 'The is valid field is required.',
            'is_valid.boolean' => 'The is valid field must be true or false.',
            'is_periodic.required' => 'The is periodic field is required.',
            'is_periodic.boolean' => 'The is periodic field must be true or false.',
            'eco_category.required' => 'The eco category is required.',
            'eco_category.string' => 'The eco category must be a string.',
            'eco_category.max' => 'The eco category must not exceed 255 characters.',
            'raw_response.required' => 'The raw response is required.',
            'raw_response.array' => 'The raw response must be an array.',
        ];
    }
}

