<?php

namespace Domain\Payment\Actions;

use Barryvdh\DomPDF\Facade\Pdf;
use Domain\Payment\Models\DebitNote;
use Domain\Payment\Models\Installment;
use Illuminate\Support\Facades\Log;

class GenerateAndStoreDebitNoteAction
{
    /**
     * Generate the Debit Note PDF for an installment, store it on the private disk,
     * and return the absolute path and filename for attaching to emails.
     *
     * @param Installment $installment
     * @return array{absolute_path:string, filename:string}|null
     */
    public function handle(Installment $installment): ?DebitNote
    {
        $policy = $installment->policy;
        if (!$policy) {
            return null;
        }

        $user = $policy->user;
        $profile = $user?->profile;
        $address = $profile?->address;
        $payment = $installment->payment;

        $noteData = [
            // Supplier (static for now)
            'supplier' => config('debit-note.supplier'),
            // Client
            'client' => [
                'name' => $user?->fullName,
                'city' => $address?->town?->name,
                'address' => $address?->address,
                'pin_type' => $profile?->personalIdentificationNumberType?->name ?? '',
                'pin' => $profile?->personal_identification_number,
            ],
            // Payment and policy
            'policy_number' => $policy->policy_number ?? $policy->payment_reference ?? '',
            'policy_title' => $policy->title,
            'policy_insurance_type' => $policy->insuranceType?->name ?? '',
            'installment_sequence' => $installment->sequence,
            'insured_object' => $policy->title,
            'due_date' => $installment->due_date ? \Carbon\Carbon::parse($installment->due_date)->format('d.m.Y') : null,
            'amount' => number_format(($payment->amount ?? 0) / 100, 2) ?? '',
            'currency' => optional($installment?->currency)->axiom_id ?? '',
            'payment_method' => $payment->paymentMethod ?? '-',
            'created_at' => now()->format('d.m.Y'),
            'created_by' => 'Бизо БГ',
            // Bank details (static for now)
            'bank' => config('debit-note.bank'),
            'watermark' => config('debit-note.watermark'),
        ];

        $pdf = Pdf::loadView('pdfs.debitNote', ['data' => $noteData])
            ->setPaper('a4')
            ->setOptions(['defaultFont' => 'DejaVu Sans']);

        $fileName = $this->buildFileName($installment);

        $debitNote = new DebitNote([
            'installment_id' => $installment->id,
        ]);

        $debitNote->save();

        $base64Pdf = base64_encode($pdf->output());

        $debitNote->addMediaFromBase64($base64Pdf)
            ->usingFileName($fileName)
            ->toMediaCollection(DebitNote::MEDIA_COLLECTION);

        return $debitNote;
    }

    protected function buildFileName(Installment $installment): string
    {
        $policyNumber = $installment->policy?->policy_number ?? $installment->policy?->payment_reference ?? 'unknown';
        $sequence = $installment->sequence ?? '1';
        return "debit-note-{$policyNumber}-v{$sequence}.pdf";
    }
}


