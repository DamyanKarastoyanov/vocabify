<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Models\CardPayment;

class CreateCardPaymentAction
{
    public function __construct(
        protected NotifyCardPaymentSuccessAction $notifyCardPaymentSuccessAction
    ) {
        //
    }

    public function handle(array $paymentData, bool $shouldNotify = false): CardPayment
    {
        $cardPayment = new CardPayment();

        $cardPayment->fill($paymentData);
        $cardPayment->save();

        if ($shouldNotify) {
            $this->notifyCardPaymentSuccessAction->handle($cardPayment);
        }

        return $cardPayment;
    }
}
