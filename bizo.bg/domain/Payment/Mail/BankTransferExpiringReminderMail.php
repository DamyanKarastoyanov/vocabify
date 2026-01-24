<?php

namespace Domain\Payment\Mail;

use Domain\Payment\Models\BankTransfer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class BankTransferExpiringReminderMail extends Mailable implements ShouldQueue
{
	use Queueable, SerializesModels;

	/**
	 * @var Collection<int, BankTransfer>
	 */
	protected Collection $bankTransfers;

	public function __construct(Collection $bankTransfers)
	{
		$this->bankTransfers = $bankTransfers;
		$this->onQueue('emails');
	}

	public function build()
	{
		$data = [
			'subject' => 'Bizo - Изтичащи банкови преводи (следващи 24ч.)',
            'payments_link' => route('payments.admin.index'),
            'name' => 'Админ',
			'items' => $this->bankTransfers->map(function (BankTransfer $transfer) {
				$policy = optional(optional($transfer->installment)->policy);
				$expiryAt = $transfer->created_at->copy()->addDays(3);
				return [
					'id' => $transfer->id,
					'policy_number' => $policy?->policy_number,
                    'policy_link' => $policy ? route('policies.admin.index', [
                        'filter' => 'policy_number:' . $policy->policy_number,
                    ]) : null,
					'transfer_link' => route('payments.admin.index', ['filter' => 'id:' . $transfer->id]),
                    'time_remaining' => $expiryAt->diffForHumans(),
				];
			}),
		];


		return $this->markdown('emails.bankTransferExpiringReminder')
			->subject($data['subject'])
			->with('data', $data);
	}
}


