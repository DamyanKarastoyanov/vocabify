<?php

namespace Domain\Broqee\MTPLInsurance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BroqeeMTPLInsuranceCheckCalculationRequest extends FormRequest
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
            'calculation_id' => 'required|integer|min:1',
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
            'calculation_id.required' => 'ID на калкулацията е задължително.',
            'calculation_id.integer' => 'ID на калкулацията трябва да бъде число.',
        ];
    }
}

