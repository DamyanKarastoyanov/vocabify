<?php

namespace Domain\Users\Services;

use Domain\Users\Services\OptIn\OptInContext;
use Domain\Users\Services\OptIn\OptInHandledResult;
use Domain\Users\Services\OptIn\OptInServiceHandler;
use Domain\Users\Actions\HandleMtplOptInAction;
use Domain\Users\Actions\HandleVignetteOptInAction;
use Domain\Users\Actions\HandleInspectionOptInAction;
use Domain\Users\Actions\HandleMVRFinesOptInAction;
use InvalidArgumentException;

class OptInActionResolver
{
    /**
     * @param iterable<OptInServiceHandler> $handlers
     */
    public function __construct(
        private HandleMtplOptInAction $handleMtplOptInAction,
        private HandleVignetteOptInAction $handleVignetteOptInAction,
        private HandleInspectionOptInAction $handleInspectionOptInAction,
        private HandleMVRFinesOptInAction $handleMVRFinesOptInAction,
    ) {
        //
    }

    private function getHandlers(): iterable
    {
        yield $this->handleMtplOptInAction;
        yield $this->handleVignetteOptInAction;
        yield $this->handleInspectionOptInAction;
        yield $this->handleMVRFinesOptInAction;
    }

    public function handle(string $serviceType, string $regNumber, array $results): OptInHandledResult
    {
        $ctx = new OptInContext($serviceType, $regNumber, $results);

        foreach ($this->getHandlers() as $handler) {
            if ($handler->supports($serviceType)) {
                return $handler->handle($ctx);
            }
        }

        throw new InvalidArgumentException("Unknown service type: {$serviceType}");
    }
}

