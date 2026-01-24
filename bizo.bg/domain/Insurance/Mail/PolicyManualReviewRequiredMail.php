<?php

namespace Domain\Insurance\Mail;

use Domain\Insurance\Models\Policy;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class PolicyManualReviewRequiredMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(Policy $policy)
    {
        $this->data = [
            'policy_id' => $policy->id,
            'policy_number' => $policy->policy_number,
            'insurance_type_name' => $policy->insuranceType->name,
            'user_name' => optional($policy->user)->profile?->first_name ?? null,
            'user_full_name' => optional($policy->user)->full_name ?? null,
            'start_date' => $policy->start_date,
            'end_date' => $policy->end_date,
            'start_date_formatted' => Carbon::parse($policy->start_date)->format('d.m.Y') . ' г.',
            'end_date_formatted' => Carbon::parse($policy->end_date)->format('d.m.Y') . ' г',
            'policy_link' => route('policies.admin.index', [
                'filter' => 'policy_number:' . $policy->policy_number,
            ]),
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo - Необходима е ръчна проверка (Полица)';

        return $this->markdown('emails.policyManualReviewRequired')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}


