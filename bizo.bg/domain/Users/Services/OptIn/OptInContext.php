<?php

namespace Domain\Users\Services\OptIn;

final class OptInContext
{
    public function __construct(
        public readonly string $serviceType,
        public readonly string $regNumber,
        public readonly array $results,
    ) {}
}

