<?php

namespace Domain\Payment\Mail;

use Domain\Payment\Models\CardPayment;
use Domain\Payment\Models\Installment;
use Domain\Payment\Services\CurrencyHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Domain\Payment\Actions\GenerateAndStoreDebitNoteAction;
use Domain\Payment\Models\DebitNote;
use Domain\Insurance\Models\PolicyStatus;

class CardPaymentSuccessMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(Installment $installment, CardPayment $cardPayment)
    {
        $currency = optional($installment->currency)->axiom_id;
        $paid_amount = $cardPayment->amount / 100;
        $pricing = CurrencyHelper::dualPricing($paid_amount, $currency);

        $this->data = [
            'name' => $installment->policy->user->profile?->first_name ?? null,
            'policy_number' => $installment->policy->policy_number ?? $installment->policy->payment_reference,
            'is_in_manual_review' => $installment->policy->internalStatus?->code === PolicyStatus::STATUSES['MANUAL_REVIEW'],
            'insurance_type_name' => $installment->policy->insuranceType->name,
            'installment_sequence' => $installment->sequence,
            'price' => $pricing['formatted'],
            'installment_id' => $installment->id,
            'my_policies_link' => route('policies.index'),
            'welcome_link' => route('welcome'),
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo - Успешно плащане с карта';

        $mail = $this->markdown('emails.cardPaymentSuccess')
            ->subject($this->data['subject'])
            ->with('data', $this->data);

        $installment = Installment::find($this->data['installment_id']);
        if (!$installment) {
            return $mail;
        }

        $debitNote = $installment->debitNote;

        if(!$debitNote) {
            // Generate and attach Debit Note PDF
            $generator = app(GenerateAndStoreDebitNoteAction::class);
            $debitNote = $generator->handle($installment);
        }

        if ($debitNote) {
            $media = $debitNote->getFirstMedia(DebitNote::MEDIA_COLLECTION);
            
            if ($media) {
                $mail->attachFromStorageDisk(
                    $media->disk,
                    $media->getPathRelativeToRoot(),
                    $media->file_name,
                    [
                        'mime' => $media->mime_type,
                    ]
                );
            }
        }

        return $mail;
    }
}
