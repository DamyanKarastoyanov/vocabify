<?php

namespace Domain\Payment\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InstallmentGuestPaymentCallbackRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'orderId' => ['required', 'string'],
        ];
    }
}
