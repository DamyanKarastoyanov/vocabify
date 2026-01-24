<?php

namespace Domain\Payment\Requests;

use Domain\Payment\Models\InstallmentGuestPayment;
use Illuminate\Foundation\Http\FormRequest;

class InstallmentGuestPaymentRequest extends FormRequest
{
    protected ?InstallmentGuestPayment $guestPayment = null;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'token' => $this->route('token'),
        ]);
    }

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
            'token' => ['required', 'string', 'exists:installment_guest_payments,token'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $token = (string) $this->input('token', '');

            $guestPayment = InstallmentGuestPayment::resolveByToken($token);

            if (!$guestPayment) {
                $validator->errors()->add('token', 'Невалиден токен.');
                return;
            }

            if ($guestPayment->isExpired()) {
                $validator->errors()->add('token', 'Линка за плащане е изтекъл.');
                return;
            }

            $this->guestPayment = $guestPayment;
        });
    }

    protected function passedValidation(): void
    {
        if ($this->guestPayment) {
            $this->merge([
                'guest_payment' => $this->guestPayment,
            ]);
        }
    }
}
