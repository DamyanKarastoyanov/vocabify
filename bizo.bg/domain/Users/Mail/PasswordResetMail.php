<?php

namespace Domain\Users\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo - Възстановяване на парола';

        return $this->markdown('emails.passwordReset')
            ->subject($this->data['subject'])
            ->with([
                'reset_url' => $this->data['reset_url'],
            ]);
    }
}


