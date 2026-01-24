<?php

namespace App\Http\Web\Profile\Controllers;

use App\Http\Web\Profile\Queries\ProfileQuery;
use App\Http\Web\Profile\Resources\ProfileResource;
use Domain\Users\Models\User;
use Domain\Users\Requests\ViewProfileRequest;
use Inertia\Response;

class ProfileController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        ViewProfileRequest $request,
        User $user,
    ): Response {
        return inertia('profile/profile', [
            'profile' => fn() => ProfileResource::make((new ProfileQuery($request, $user))->get()),
        ]);
    }
}
