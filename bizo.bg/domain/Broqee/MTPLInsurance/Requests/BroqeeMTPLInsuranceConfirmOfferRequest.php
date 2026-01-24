<?php

namespace Domain\Broqee\MTPLInsurance\Requests;

use Domain\Vehicles\Models\VehicleSpecification;
use Illuminate\Foundation\Http\FormRequest;

class BroqeeMTPLInsuranceConfirmOfferRequest extends FormRequest
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
        return [
            'offer' => 'required|integer|min:1',
            'custom_data.policy_start_date' => 'required|date_format:Y-m-d|after_or_equal:today',
            'custom_data.insured_country' => 'required|string',
            'custom_data.insured_location_primary' => 'nullable|integer',
            'custom_data.vehicle_usage_primary' => 'nullable|integer',
            'custom_data.wheel_direction' => 'required',
            'custom_data.engine_volume' => 'required|integer',
            'data' => 'required|array',
            'data.names' => 'required|string',
            'data.phone' => 'required|string',
            'data.email' => 'required|string',
        ];
    }

    protected function prepareForValidation(): void
    {
        $vehicle = $this->input('vehicle', []);
        $insured = $this->input('insured', []);
        $policy = $this->input('policy', []);
        
        $this->merge([
            'custom_data' => [
                'vehicle_usage_primary' => $vehicle['usage'] ?? null,
                'wheel_direction' => $vehicle['wheel_direction'],
                'insured_location_primary' => $insured['location'] ?? null,
                'policy_start_date' => $policy['policy_start_date'] ?? null,
                'insured_country' => 'България',
                'engine_volume' => $vehicle['engine_volume'] ?? null,
            ],
            'data' => [
                'names' => $insured['insured_names'] ?? null,
                'phone' => $insured['insured_phone'] ?? null,
                'email' => $insured['insured_email'] ?? null,
            ],
        ]);
    }
}
