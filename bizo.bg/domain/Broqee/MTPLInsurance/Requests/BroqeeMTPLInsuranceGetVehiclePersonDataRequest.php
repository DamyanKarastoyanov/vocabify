<?php

namespace Domain\Broqee\MTPLInsurance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BroqeeMTPLInsuranceGetVehiclePersonDataRequest extends FormRequest
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
            'number' => 'required|string',
            'talon' => 'required|string',
        ];
    }
}
