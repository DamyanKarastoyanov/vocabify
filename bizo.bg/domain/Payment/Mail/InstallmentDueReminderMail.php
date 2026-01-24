<?php

namespace Domain\Payment\Mail;

use Domain\Payment\Actions\GenerateInstallmentGuestPaymentAction;
use Domain\Payment\Models\Installment;
use Domain\Payment\Services\CurrencyHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class InstallmentDueReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    /**
     * Create a new message instance.
     */
    public function __construct(Installment $installment)
    {
        $currency = optional($installment->currency)->axiom_id;
        $expected_amount = number_format($installment->amount_due, 2);
        $pricing = CurrencyHelper::dualPricing($expected_amount, $currency);
        $user = $installment->policy->user;

        if ($user->is_active) {
            $paymentLink = route('installments.index', ['installmentId' => $installment->id]);
        } else {
            $guestPayment = app(GenerateInstallmentGuestPaymentAction::class)->handle($installment);
            $paymentLink = route('installments.guest-payment', ['token' => $guestPayment->token]);
        }

        $this->data = [
            'name' => $user->profile?->first_name ?? null,
            'policy_number' => $installment->policy->policy_number,
            'insurance_type_name' => $installment->policy->insuranceType->name,
            'due_date' => $installment->due_date,
            'due_date_formatted' => Carbon::parse($installment->due_date)->format('d.m.Y'),
            'price' => $pricing['formatted'],
            'payment_link' => $paymentLink,
            'installments_link' => route('installments.index'),
        ];

        $this->onQueue('emails');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $this->data['subject'] = 'Bizo - Предстояща вноска по полица';

        return $this->markdown('emails.installmentDueReminder')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}
