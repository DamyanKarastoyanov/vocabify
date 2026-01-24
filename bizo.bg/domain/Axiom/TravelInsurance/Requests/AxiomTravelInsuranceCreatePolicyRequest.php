<?php

namespace Domain\Axiom\TravelInsurance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AxiomTravelInsuranceCreatePolicyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // erm, we do not have a role-permission model yet
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
            'offer_id' => 'required|numeric',
        ];
    }
}
