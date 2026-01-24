<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Activation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GenerateUserActivationToken
{
    public function handle(int $user_id): String
    {
        $rawToken = Str::random(40);
        $activation = Activation::create([
            'user_id' => $user_id,
            'token' => Hash::make($rawToken),
            'expires_at' => now()->addMinutes(60),
        ]);

        return $rawToken;
    }
}
