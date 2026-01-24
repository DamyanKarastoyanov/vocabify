<?php

namespace Domain\Users\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountActivationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
        $this->onQueue('emails');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->data['subject'] = 'Bizo - Активация на акаунт';

        return $this->markdown('emails.accountActivation')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}
