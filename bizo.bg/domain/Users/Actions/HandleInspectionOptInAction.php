<?php

namespace Domain\Users\Actions;

use Domain\Users\Services\OptIn\OptInContext;
use Domain\Users\Services\OptIn\OptInHandledResult;
use Domain\Users\Services\OptIn\OptInServiceHandler;
use Domain\Vehicles\Actions\CreateVehicleFromInspectionDataAction;

class HandleInspectionOptInAction implements OptInServiceHandler
{
    public function __construct(
        private CreateVehicleFromInspectionDataAction $createVehicleFromInspectionDataAction,
    ) {
        //
    }

    public function supports(string $serviceType): bool
    {
        return $serviceType === 'vehicle-inspection';
    }

    public function handle(OptInContext $ctx): OptInHandledResult
    {
        $vehicle = $this->createVehicleFromInspectionDataAction->handle($ctx->results);

        return new OptInHandledResult(
            serviceType: $ctx->serviceType,
            vehicleId: $vehicle?->id,
            status: $vehicle ? 'updated' : 'skipped'
        );
    }
}

