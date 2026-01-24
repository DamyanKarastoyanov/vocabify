<?php

namespace App\Http\Web\OptIn\Controllers;

use App\Http\Web\OptIn\Requests\OptInUnsubscribeRequest;
use Domain\Users\Actions\UpdateOptInAction;
use Domain\Users\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class OptInUnsubscribeController
{
    public function __construct(
        protected UpdateOptInAction $updateOptInAction,
    ) {
        //
    }

    public function __invoke(OptInUnsubscribeRequest $request): RedirectResponse
    {
        $userId = $request->validated('user');
        
        $user = User::findOrFail($userId);
        $this->updateOptInAction->handle($user, false);

        return redirect()->route('opt-in.unsubscribe.success', ['unsubscribedUserId' => $userId]);
    }
}
