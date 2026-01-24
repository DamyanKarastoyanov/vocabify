<?php

namespace Domain\Axiom\HomeInsurance\Requests;

use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsuranceOffer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AxiomHomeInsuranceCreatePolicyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $offer_id = $this->input('offer_id');

        $offer = AxiomHomeInsuranceOffer::findOrFail($offer_id);

        return Auth::user()?->can('view', $offer) ?? true;
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
