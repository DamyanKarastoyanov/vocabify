<?php

namespace Domain\Insurance\Mail;

use Domain\Insurance\Models\Policy;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class PolicyExpirationReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $data;

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
            'expiration_date' => $policy->end_date,
            'expiration_date_formatted' => Carbon::parse($policy->end_date)->format('d.m.Y'),
            'policy_link' => route('policies.index', ['policyId' => $policy->id]),
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
        $this->data['subject'] = 'Bizo - Изтичаща полица';

        return $this->markdown('emails.policyExpirationReminder')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}
