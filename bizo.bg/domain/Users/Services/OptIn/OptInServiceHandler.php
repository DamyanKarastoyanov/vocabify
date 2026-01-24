<?php

namespace Domain\Users\Services\OptIn;

use Domain\Users\Services\OptIn\OptInContext;
use Domain\Users\Services\OptIn\OptInHandledResult;

interface OptInServiceHandler
{
    public function supports(string $serviceType): bool;

    public function handle(OptInContext $ctx): OptInHandledResult;
}

