<?php

namespace Domain\Payment\Mail;

use Domain\Payment\Models\Installment;
use Domain\Payment\Services\CurrencyHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class BankTransferInitiationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(Installment $installment)
    {
        $authenticatedUser = Auth::user();

        $currency = optional($installment->currency)->axiom_id;
        $expected_amount = number_format($installment->amount_due, 2);
        $pricing = CurrencyHelper::dualPricing($expected_amount, $currency);

        $bankDetails = config('debit-note.bank');

        $this->data = [
            'name' => $authenticatedUser?->profile?->first_name ?? optional($installment->policy)->user?->profile?->first_name ?? null,
            'policy_number' => optional($installment->policy)->policy_number ?? optional($installment->policy)->payment_reference ?? null,
            'insurance_type_name' => $installment->policy->insuranceType->name,
            'price' => $pricing['formatted'],
            'installments_link' => route('installments.index'),
            'bank_details' => $bankDetails,
        ];
        
        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo - Иницииран банков превод';

        return $this->markdown('emails.bankTransferInitiation')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}


