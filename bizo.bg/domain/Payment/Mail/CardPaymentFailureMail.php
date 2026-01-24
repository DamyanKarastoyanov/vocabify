<?php

namespace Domain\Payment\Mail;

use Domain\Payment\Models\Installment;
use Domain\Payment\Services\CurrencyHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CardPaymentFailureMail extends Mailable implements ShouldQueue
{
	use Queueable, SerializesModels;

	protected array $data;

	public function __construct(Installment $installment, string $errorMessage)
	{
		$currency = optional($installment->currency)->axiom_id;

		$expected_amount = number_format($installment->amount_due, 2);
		$pricing = CurrencyHelper::dualPricing($expected_amount, $currency);

		$this->data = [
			'name' => $installment->policy->user->profile?->first_name ?? null,
			'policy_number' => $installment->policy->policy_number ?? $installment->policy->payment_reference,
			'installment_sequence' => $installment->sequence,
			'price' => $pricing['formatted'],
			'policy_link' => route('policies.index', ['policy' => $installment->policy->id]),
		];

		$this->onQueue('emails');
	}

	public function build()
	{
		return $this->markdown('emails.cardPaymentFailure')
			->subject('Bizo - Неуспешно плащане с карта')
			->with('data', $this->data);
	}
}
