<?php

namespace Domain\Insurance\Mail;

use Domain\Insurance\Models\Policy;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class PolicyCancellationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Policy $policy)
    {
        $this->data = [
            'name' => $policy->user->profile?->first_name ?? null,
            'policy_number' => $policy->policy_number,
            'insurance_type_name' => $policy->insuranceType->name,
            'start_date' => $policy->start_date,
            'end_date' => $policy->end_date,
            'start_date_formatted' => Carbon::parse($policy->start_date)->format('d.m.Y') . ' г.',
            'end_date_formatted' => Carbon::parse($policy->end_date)->format('d.m.Y') . ' г',
            'policies_link' => route('policies.index'),
            'welcome_link' => route('welcome'),
        ];

        $this->onQueue('emails');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->data['subject'] = 'Bizo - Анулирана полица';

        return $this->markdown('emails.policyCancellation')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}


