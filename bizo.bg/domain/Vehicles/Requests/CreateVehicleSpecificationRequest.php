<?php

namespace Domain\Vehicles\Requests;

use Domain\Vehicles\Models\VehicleSpecification;
use Illuminate\Foundation\Http\FormRequest;

class CreateVehicleSpecificationRequest extends FormRequest
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
            'mark' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'engine_volume' => 'required|string|max:255',
            'engine_power' => 'required|string|max:255',
            'manufactured_year' => 'required|integer|min:1900|max:'.(date('Y') + 1),
            'euro_standard' => 'nullable|string|max:255',
            'wheel_direction' => 'nullable|in:' . implode(',', VehicleSpecification::getWheelDirectionValues()),
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'vehicle_id.required' => 'The vehicle is required.',
            'vehicle_id.exists' => 'The selected vehicle is invalid.',
            'mark.required' => 'The mark (brand) is required.',
            'mark.string' => 'The mark must be a string.',
            'mark.max' => 'The mark must not exceed 255 characters.',
            'model.required' => 'The model is required.',
            'model.string' => 'The model must be a string.',
            'model.max' => 'The model must not exceed 255 characters.',
            'engine_volume.required' => 'The engine volume is required.',
            'engine_volume.string' => 'The engine volume must be a string.',
            'engine_volume.max' => 'The engine volume must not exceed 255 characters.',
            'engine_power.required' => 'The engine power is required.',
            'engine_power.string' => 'The engine power must be a string.',
            'engine_power.max' => 'The engine power must not exceed 255 characters.',
            'manufactured_year.required' => 'The manufactured year is required.',
            'manufactured_year.integer' => 'The manufactured year must be an integer.',
            'manufactured_year.min' => 'The manufactured year must be at least 1900.',
            'manufactured_year.max' => 'The manufactured year must not exceed '.(date('Y') + 1).'.',
            'euro_standard.string' => 'The euro standard must be a string.',
            'euro_standard.max' => 'The euro standard must not exceed 255 characters.',
            'wheel_direction.in' => 'The wheel direction must be either ' . implode(' or ', VehicleSpecification::getWheelDirectionValues()) . '.',
        ];
    }
}

