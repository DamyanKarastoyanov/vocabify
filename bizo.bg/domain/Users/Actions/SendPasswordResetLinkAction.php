<?php

namespace Domain\Users\Actions;

use Domain\Users\Mail\PasswordResetMail;
use Illuminate\Support\Facades\Mail;

class SendPasswordResetLinkAction
{
    public function __construct(
        private GeneratePasswordResetDataAction $generatePasswordResetDataAction
    ) {
    }

    public function handle(string $email): void
    {
        $data = $this->generatePasswordResetDataAction->handle($email);

        if (! $data) {
            return ;
        }

        Mail::to($data['email'])->send(new PasswordResetMail($data));
    }
}


