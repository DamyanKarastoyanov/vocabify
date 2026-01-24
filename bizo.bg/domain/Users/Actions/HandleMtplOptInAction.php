<?php

namespace Domain\Users\Actions;

use Domain\Users\Services\OptIn\OptInContext;
use Domain\Users\Services\OptIn\OptInHandledResult;
use Domain\Users\Services\OptIn\OptInServiceHandler;
use Domain\Vehicles\Actions\CreateVehicleMtplCheckAction;
use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Mappers\MtplResponseMapper;
use Domain\Vehicles\Services\VehicleResolverService;

class HandleMtplOptInAction implements OptInServiceHandler
{
    public function __construct(
        private VehicleResolverService $vehicleResolverService,
        private MtplResponseMapper $mapper,
        private CreateVehicleMtplCheckAction $createVehicleMtplCheckAction,
    ) {
        //
    }

    public function supports(string $serviceType): bool
    {
        return $serviceType === 'mtpl-check';
    }

    public function handle(OptInContext $ctx): OptInHandledResult
    {
        $dto = $this->mapper->map($ctx->results);

        $vehicle = $this->vehicleResolverService->resolveVehicle(
            [
                'reg_number' => $ctx->regNumber,
            ],
            VehicleCreationSource::MTPL_CHECK
        );

        $mtplCheck = $this->createVehicleMtplCheckAction->handle(
            [
                'reg_number' => $ctx->regNumber,
            ],
            $dto->toPersistenceArray()
        );

        return new OptInHandledResult(
            serviceType: $ctx->serviceType,
            vehicleId: $vehicle->id,
            status: $mtplCheck->wasRecentlyCreated ? 'created' : 'updated'
        );
    }
}

