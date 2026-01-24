<?php

namespace Domain\Users\Actions;

use Domain\Users\Services\OptIn\OptInContext;
use Domain\Users\Services\OptIn\OptInHandledResult;
use Domain\Users\Services\OptIn\OptInServiceHandler;
use Domain\Vehicles\Actions\CreateVehicleVignetteAction;
use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Mappers\VignetteResponseMapper;
use Domain\Vehicles\Services\VehicleResolverService;

class HandleVignetteOptInAction implements OptInServiceHandler
{
    public function __construct(
        private VehicleResolverService $vehicleResolverService,
        private VignetteResponseMapper $mapper,
        private CreateVehicleVignetteAction $createVehicleVignetteAction,
    ) {
        //
    }

    public function supports(string $serviceType): bool
    {
        return $serviceType === 'vignette-check';
    }

    public function handle(OptInContext $ctx): OptInHandledResult
    {
        $dto = $this->mapper->map($ctx->results, 'BG');

        $vehicle = $this->vehicleResolverService->resolveVehicle(
            [
                'reg_number' => $ctx->regNumber,
            ],
            VehicleCreationSource::VIGNETTE
        );

        $vignette = $this->createVehicleVignetteAction->handle(
            [
                'reg_number' => $ctx->regNumber,
            ],
            $dto->toPersistenceArray()
        );

        return new OptInHandledResult(
            serviceType: $ctx->serviceType,
            vehicleId: $vehicle->id,
            status: $vignette->wasRecentlyCreated ? 'created' : 'updated'
        );
    }
}

