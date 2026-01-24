<?php

namespace Domain\Vehicles\DataTransferObjects;

use Spatie\LaravelData\Data;

class MVRFinesCheckDTO extends Data
{
    /**
     * @param MVRFinesObligationDTO[] $obligations
     */
    public function __construct(
        public string $egn,
        public string $driving_licence_number,
        public bool $has_obligations = false,
        public float $total_amount_bgn = 0,
        public float $total_amount_eur = 0,
        /** @var MVRFinesObligationDTO[] */
        public array $obligations = [],
        public array $raw_response = [],
    ) {}

    public function toPersistenceArray(): array
    {
        return [
            'egn' => $this->egn,
            'driving_licence_number' => $this->driving_licence_number,
            'has_obligations' => $this->has_obligations,
            'total_amount_bgn' => $this->total_amount_bgn,
            'total_amount_eur' => $this->total_amount_eur,
            'raw_response' => $this->raw_response,
        ];
    }
}

