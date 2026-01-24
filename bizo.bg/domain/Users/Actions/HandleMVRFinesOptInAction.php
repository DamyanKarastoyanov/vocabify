<?php

namespace Domain\Users\Actions;

use Domain\Users\Services\OptIn\OptInContext;
use Domain\Users\Services\OptIn\OptInHandledResult;
use Domain\Users\Services\OptIn\OptInServiceHandler;
use Domain\Vehicles\Actions\CreateMVRFinesCheckAction;
use Domain\Vehicles\Mappers\MVRFinesResponseMapper;

class HandleMVRFinesOptInAction implements OptInServiceHandler
{
    public function __construct(
        private MVRFinesResponseMapper $mapper,
        private CreateMVRFinesCheckAction $createMVRFinesCheckAction,
    ) {
        //
    }

    public function supports(string $serviceType): bool
    {
        return $serviceType === 'mvr-fines-check';
    }

    public function handle(OptInContext $ctx): OptInHandledResult
    {
        $dto = $this->mapper->map($ctx->results);

        $checkData = $dto->toPersistenceArray();

        $obligationsData = [];
        foreach ($dto->obligations as $obligationDTO) {
            $obligationsData[] = $obligationDTO->toPersistenceArray();
        }

        $mvrFinesCheck = $this->createMVRFinesCheckAction->handle($checkData, $obligationsData);

        return new OptInHandledResult(
            serviceType: $ctx->serviceType,
            vehicleId: null, // MVR fines don't require vehicle
            status: $mvrFinesCheck->wasRecentlyCreated ? 'created' : 'updated'
        );
    }
}

