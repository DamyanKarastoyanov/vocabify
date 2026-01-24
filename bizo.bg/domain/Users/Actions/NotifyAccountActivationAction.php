<?php

namespace Domain\Users\Actions;

use Domain\Users\Mail\AccountActivationMail;
use Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;

class NotifyAccountActivationAction
{
    public function __construct(
        protected GenerateUserActivationToken $generateUserActivationToken
    ) {
    }

    public function handle(User $user, bool $isAfterPolicyActivation = false): void
    {
        if ($user->activated_at) {
            return;
        }

        $activationToken = $this->generateUserActivationToken->handle($user->id);
        $activationLink = route('account.activate', ['token' => $activationToken]);

        Mail::to($user->email)->send(new AccountActivationMail([
            'activation_link' => $activationLink,
            'is_after_policy_activation' => $isAfterPolicyActivation,
        ]));
    }
}

