<?php

namespace App\Http\Web\OptIn\Controllers;

use Domain\Users\Actions\UpdateOptInAction;
use Domain\Users\Services\UserResolverService;
use Domain\Users\Services\OptInActionResolver;
use App\Http\Web\OptIn\Requests\OptInResubscribeRequest;

class OptInResubscribeController
{
    public function __construct(
        protected UpdateOptInAction $updateOptInAction,
        protected UserResolverService $userResolverService
    ) {
        //
    }

    public function __invoke(OptInResubscribeRequest $request)
    {
        $email = $request->validated('email');

        $user = $this->userResolverService->resolveUser($email, [], false);
        $this->updateOptInAction->handle($user, true);

        return response()->json([
            'success' => true,
            'message' => 'Opt-in resubscribed successfully',
        ]);
    }
}
