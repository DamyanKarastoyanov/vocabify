<?php

namespace Domain\Axiom\TravelInsurance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Domain\Payment\Models\Installment;
use Illuminate\Support\Facades\Gate;

class AxiomTravelInsurancePaymentCallbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $gateway_order_id = $this->query('orderId');
        $installment = Installment::where('order_number', $gateway_order_id)->first();

        if (!$installment) {
            return true;
        }

        return Auth::user()?->can('view', $installment->policy->insurable) ?? true;
    }
}
