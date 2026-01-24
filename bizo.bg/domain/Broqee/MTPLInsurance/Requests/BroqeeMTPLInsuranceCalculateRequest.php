<?php

namespace Domain\Broqee\MTPLInsurance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BroqeeMTPLInsuranceCalculateRequest extends FormRequest
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
        // Minimal validation - only required fields
        // All other fields are preserved without validation
        return [
            'vehicle.number' => 'required|string',
            'vehicle.talon' => 'required|string',
            'policy.installments' => 'required|integer|min:1|max:12',
            'policy.start_date' => 'required|date_format:Y-m-d|after_or_equal:today',

            // Optional fields - no validation, just preserve structure
            'vehicle.*' => 'nullable',
            'insured.*' => 'nullable',
            'policy.*' => 'nullable',
        ];
    }

    /**
     * Get custom validation error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'policy.start_date.after_or_equal' => 'Началната дата на полицата не може да бъде в миналото.',
            'policy.start_date.required' => 'Началната дата е задължителна.',
            'policy.start_date.date_format' => 'Началната дата трябва да бъде във формат YYYY-MM-DD.',
        ];
    }
}
