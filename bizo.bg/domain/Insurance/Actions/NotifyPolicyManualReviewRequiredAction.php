<?php

namespace Domain\Insurance\Actions;

use Domain\Insurance\Mail\PolicyManualReviewRequiredMail;
use Domain\Insurance\Models\Policy;
use Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;

class NotifyPolicyManualReviewRequiredAction
{
    public function handle(Policy $policy): void
    {
        $recipients = User::permission('edit payments')->pluck('email')->filter()->values();

        if ($recipients->isEmpty()) {
            return;
        }

        Mail::to($recipients->all())->send(new PolicyManualReviewRequiredMail($policy));
    }
}


