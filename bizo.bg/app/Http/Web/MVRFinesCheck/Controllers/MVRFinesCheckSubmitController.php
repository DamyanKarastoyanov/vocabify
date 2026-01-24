<?php

namespace App\Http\Web\MVRFinesCheck\Controllers;

use Domain\Vehicles\Actions\CheckMVRFinesAction;
use Domain\Users\Actions\UpdateProfileAction;
use Domain\Users\Models\User;
use Illuminate\Http\JsonResponse;
use Domain\Vehicles\Requests\CheckMVRFinesRequest;

class MVRFinesCheckSubmitController
{
    public function __construct(
        private readonly CheckMVRFinesAction $checkMVRFinesAction,
        private readonly UpdateProfileAction $updateProfileAction
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(CheckMVRFinesRequest $request): JsonResponse
    {
        $egn = $request->validated('egn');
        $drivingLicenceNumber = $request->validated('driving_licence_number');
        $profileId = $request->validated('profile_id');

        $result = $this->checkMVRFinesAction->handle(
            $egn,
            $drivingLicenceNumber
        );

        if ($profileId && $result['success'] ?? false) {
            $user = User::find($profileId);
            if ($user && $user->profile) {
                $profile = $user->profile->fresh();
                $this->updateProfileAction->handle($profile, [
                    'driver_license' => $drivingLicenceNumber
                ]);
            }
        }

        return response()->json($result);
    }
}

