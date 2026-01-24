<?php

namespace App\Http\Web\OptIn\Controllers;

use App\Http\Web\OptIn\Requests\OptInRequest;
use Domain\Users\Actions\UpdateOptInAction;
use Domain\Users\Services\UserResolverService;
use Domain\Users\Services\OptInActionResolver;
use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Services\VehicleResolverService;
use Domain\Vehicles\Events\ReminderSubscriptionCreatedEvent;

class OptInSubscribeController
{
    public function __construct(
        protected UpdateOptInAction $updateOptInAction,
        protected UserResolverService $userResolverService,
        protected OptInActionResolver $optInActionResolver,
        protected VehicleResolverService $vehicleResolverService,
    ) {
        //
    }

    public function __invoke(OptInRequest $request)
    {
        $email = $request->validated('email');
        $optIn = $request->validated('optIn');
        $regNumber = $request->validated('reg_number');
        $serviceType = $request->validated('serviceType');
        $results = $request->validated('results');

        $user = $this->userResolverService->resolveUser($email, [], false);
        $this->updateOptInAction->handle($user, $optIn);

        $vehicle = $this->vehicleResolverService->resolveVehicle([
            'reg_number' => $regNumber,
        ], VehicleCreationSource::OPT_IN, $user->id);

        ReminderSubscriptionCreatedEvent::dispatch($vehicle, $user);

        if ($serviceType && $results) {
            $result = $this->optInActionResolver->handle($serviceType, $regNumber, $results);

            return response()->json([
                'success' => true,
                'message' => 'Opt-in successful',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Opt-in failed',
        ]);
    }
}
