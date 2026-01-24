<?php

namespace Domain\Axiom\TravelInsurance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AxiomTravelInsurancePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $offer = $this->route('offer');

        return Auth::user()?->can('view', $offer) ?? true;
    }
}
