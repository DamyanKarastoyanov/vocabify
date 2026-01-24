<?php

namespace App\Http\Web\Installments\Queries;

use Domain\Payment\Models\BankTransfer;
use Domain\Payment\Models\CardPayment;
use Domain\Payment\Models\Installment;
use Illuminate\Http\Request;

class InstallmentDetailsQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Installment $installment,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $payment = $this->installment->payment;
        $installmentsCount = $this->installment->policy->installments->count();

        $payment ? $paymentType = match (get_class($payment)) {
            CardPayment::class => 'Плащане с карта',
            BankTransfer::class => 'Плащане с банков превод',
            default => '-',
        } : $paymentType = '-';

        $debit_note_id = $this->installment->debitNote?->id ?? 0;

        $result = [
            'status' => $payment?->paymentStatus->name ?? 'Pending',
            'title' => $this->installment->policy->title,
            'due_date' => $this->installment->due_date,
            'insurer_name' => $this->installment->policy->insuranceCompany->name ?? 'Unknown',
            'price' => $this->installment->price,
            'payment_type' => $paymentType,
            'installment_number' => $this->installment->sequence,
            'installment_total_count' => $installmentsCount,
        ];

        if($debit_note_id) {
            $result['debit_note_download_url'] = route('debit-note.download', $debit_note_id);
            $result['debit_note_view_url'] = route('debit-note.view', $debit_note_id);
        }

        return $result;
    }
}
