<?php

namespace Domain\Users\Services;

use Domain\Users\Actions\CreateUserAction;
use Domain\Users\Models\User;
use Illuminate\Support\Facades\Auth;

class UserResolverService
{
    public function __construct(
        protected CreateUserAction $createUserAction
    ) {
        //
    }

    public function resolveUser(?string $email, array $userData = [], ?bool $shouldCheckIfLogged = true): User
    {
        if ($shouldCheckIfLogged && Auth::check()) {
            return Auth::user();
        }

        if(!$email) {
            throw new \InvalidArgumentException('Email is required to resolve user.');
        }

        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            return $existingUser;
        }

        $defaultUserData = [
            'email' => $email,
            'is_active' => false,
            'password' => bcrypt('default_password'),
        ];

        $userData = array_merge($defaultUserData, $userData);

        return $this->createUserAction->handle($userData);
    }
}
