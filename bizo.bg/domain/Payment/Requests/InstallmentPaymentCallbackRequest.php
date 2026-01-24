<?php

namespace Domain\Payment\Requests;

use Domain\Payment\Models\Installment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class InstallmentPaymentCallbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $orderId = $this->query('orderId');

        $installment = Installment::where('order_number', $orderId)->firstOrFail();

        return Auth::user()->can('view', $installment);
    }
}
