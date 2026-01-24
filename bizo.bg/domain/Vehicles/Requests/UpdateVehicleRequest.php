<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $vehicle = $this->route('vehicle');

        return Auth::user()->can('update', $vehicle);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'user_id' => 'nullable|exists:users,id',
            'vin' => 'sometimes|required|string|max:255',
            'talon' => 'sometimes|required|string|max:255',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'user_id.exists' => 'The selected user is invalid.',
            'vin.required' => 'The VIN is required.',
            'vin.string' => 'The VIN must be a string.',
            'vin.max' => 'The VIN must not exceed 255 characters.',
            'talon.required' => 'The TALON is required.',
            'talon.string' => 'The TALON must be a string.',
            'talon.max' => 'The TALON must not exceed 255 characters.',
        ];
    }
}

