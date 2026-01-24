<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\User;
use Illuminate\Support\Facades\Password;

class GeneratePasswordResetDataAction
{
    public function handle(string $email): ?array
    {
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            return null;
        }

        /** @var \Illuminate\Auth\Passwords\PasswordBroker $broker */
        $broker = Password::broker();
        $token = $broker->createToken($user);

        return [
            'name' => $user->fullName ?? $user->name ?? $user->email,
            'email' => $user->email,
            'reset_url' => route('password.reset', ['token' => $token, 'email' => $user->email]),
        ];
    }
}

