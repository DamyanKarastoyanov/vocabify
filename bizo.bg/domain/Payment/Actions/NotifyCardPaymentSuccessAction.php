<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Mail\CardPaymentSuccessMail;
use Domain\Payment\Models\CardPayment;
use Domain\Payment\Models\Installment;
use Illuminate\Support\Facades\Mail;

class NotifyCardPaymentSuccessAction
{
    public function handle(CardPayment $cardPayment, ?string $receiptPath = null): void
    {
        $installment = Installment::where('order_number', $cardPayment->reference_number)
            ->with(['policy.user', 'currency'])
            ->first();

        if (!$installment || !$installment->policy || !$installment->policy->user) {
            return;
        }

        Mail::to($installment->policy->user->email)
            ->send(new CardPaymentSuccessMail($installment, $cardPayment, $receiptPath));
    }
}
