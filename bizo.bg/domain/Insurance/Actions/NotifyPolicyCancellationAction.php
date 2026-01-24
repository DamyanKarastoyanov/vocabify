<?php

namespace Domain\Insurance\Actions;

use Domain\Insurance\Mail\PolicyCancellationMail;
use Domain\Insurance\Models\Policy;
use Illuminate\Support\Facades\Mail;

class NotifyPolicyCancellationAction
{
    public function handle(Policy $policy): void
    {
        $user = $policy->user;

        if (!$user || !$user->email) {
            return;
        }

        Mail::to($user->email)->send(new PolicyCancellationMail($policy));
    }
}


