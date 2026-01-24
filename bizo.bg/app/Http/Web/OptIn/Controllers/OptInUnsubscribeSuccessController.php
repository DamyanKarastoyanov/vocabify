<?php

namespace App\Http\Web\OptIn\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Domain\Users\Models\User;
use App\Http\Web\OptIn\Requests\OptInUnsubscribeSuccessRequest;

class OptInUnsubscribeSuccessController
{
    public function __invoke(OptInUnsubscribeSuccessRequest $request): Response
    {
        $unsubscribedUserId = $request->validated('unsubscribedUserId');
        $user = User::findOrFail($unsubscribedUserId);

        return Inertia::render('opt-in-unsubscribe-success/opt-in-unsubscribe-success', [
            'unsubscribedUser' => [
                'id' => $user->id, 
                'email' => $user->email
            ],
        ]);
    }
}
