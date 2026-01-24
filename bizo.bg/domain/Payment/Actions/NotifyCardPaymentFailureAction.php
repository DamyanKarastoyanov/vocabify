<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Mail\CardPaymentFailureMail;
use Domain\Payment\Models\Installment;
use Illuminate\Support\Facades\Mail;

class NotifyCardPaymentFailureAction
{
	public function handle(Installment $installment, string $errorMessage): void
	{
		if (!$installment || !$installment->policy || !$installment->policy->user) {
		    return;
		}

		Mail::to($installment->policy->insurable->user->email)
			->send(new CardPaymentFailureMail($installment, $errorMessage));
	}
}
