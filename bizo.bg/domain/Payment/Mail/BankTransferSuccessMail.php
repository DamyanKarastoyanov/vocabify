<?php

namespace Domain\Payment\Mail;

use Domain\Payment\Models\BankTransfer;
use Domain\Payment\Services\CurrencyHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Domain\Payment\Actions\GenerateAndStoreDebitNoteAction;
use Domain\Payment\Models\DebitNote;
use Domain\Payment\Models\Installment;

class BankTransferSuccessMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(BankTransfer $bankTransfer)
    {
        $installment = $bankTransfer->installment;

        $currency = $installment?->currency?->axiom_id;
        $paidAmount = number_format(($bankTransfer->amount ?? 0) / 100, 2)  ;
        $pricing = CurrencyHelper::dualPricing($paidAmount, $currency);


        $this->data = [
            'name' => optional(optional($installment)->policy?->user)->profile?->first_name ?? optional($bankTransfer->user)->profile?->first_name ?? null,
            'policy_number' => optional($installment?->policy)->policy_number ?? optional($installment?->policy)->payment_reference,
            'insurance_type_name' => optional($installment?->policy?->insuranceType)->name,
            'price' => $pricing['formatted'],
            'my_payments_link' => route('installments.index'),
            'welcome_link' => route('welcome'),
            'installment_id' => $installment?->id,
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo - Успешно потвърден банков превод';

        $mail = $this->markdown('emails.bankTransferSuccess')
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


