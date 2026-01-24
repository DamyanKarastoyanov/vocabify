<?php

namespace Domain\Users\Services\OptIn;

final class OptInHandledResult
{
    public function __construct(
        public readonly string $serviceType,
        public readonly ?int $vehicleId,
        public readonly string $status, // 'created' | 'updated' | 'skipped'
    ) {}
}

