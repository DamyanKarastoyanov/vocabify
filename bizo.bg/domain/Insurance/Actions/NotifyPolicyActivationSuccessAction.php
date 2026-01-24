<?php

namespace Domain\Insurance\Actions;

use Domain\Insurance\Mail\PolicyActivationMail;
use Domain\Insurance\Models\Policy;
use Illuminate\Support\Facades\Mail;

class NotifyPolicyActivationSuccessAction
{
    public function handle(Policy $policy): void
    {
        $user = $policy->user;

        if (!$user || !$user->email) {
            return;
        }

        Mail::to($user->email)->send(new PolicyActivationMail($policy));
    }
}


