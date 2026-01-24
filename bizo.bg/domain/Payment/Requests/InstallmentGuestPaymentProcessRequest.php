<?php

namespace Domain\Payment\Requests;

use Domain\Payment\Models\InstallmentGuestPayment;
use Illuminate\Foundation\Http\FormRequest;

class InstallmentGuestPaymentProcessRequest extends FormRequest
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
            'payment_type' => ['sometimes', 'string', 'in:card_payment,bank_transfer'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $installment = $this->route('installment');
            $guestPayment = $installment->guestPayment;

            if (!$guestPayment) {
                $validator->errors()->add('installment', 'Линка за плащането не е намерен.');
                return;
            }

            if ($guestPayment->isExpired()) {
                $validator->errors()->add('installment', 'Линка за плащането е изтекъл.');
                return;
            }

            if ($installment->payment && $installment->payment->isVerified()) {
                $validator->errors()->add('installment', 'Вноската по полицата вече е платена!');
                return;
            }

        });
    }
}
