<?php

namespace Domain\Vehicles\Mail;

use Domain\Vehicles\Models\MVRFinesObligation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class NewFineMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(MVRFinesObligation $fine)
    {
        $user = $fine->user();
        
        $this->data = [
            'name' => $user?->profile?->first_name ?? null,
            'document_number' => $fine->document_number,
            'service_type_name' => 'Проверка на глоби от МВР',
            'violation_date' => $fine->violation_date,
            'violation_date_formatted' => $fine->violation_date ? Carbon::parse($fine->violation_date)->format('d.m.Y') : 'N/A',
            'violation' => $fine->violation,
            'amount_bgn' => number_format($fine->amount_bgn ?? 0, 2),
            'discount_bgn' => number_format($fine->discount_bgn ?? 0, 2),
            'amount_to_pay_bgn' => number_format($fine->amount_to_pay_bgn ?? 0, 2),
            'valid_until' => $fine->valid_until,
            'valid_until_formatted' => $fine->valid_until ? Carbon::parse($fine->valid_until)->format('d.m.Y') : 'N/A',
            'fines_link' => route('vehicles.index'), // TODO: Update to fines page
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo аларма! Нова глоба от МВР!';

        return $this->markdown('emails.newFine')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}

