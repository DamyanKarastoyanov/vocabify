<?php

namespace Domain\Vehicles\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class VignetteDTO extends Data
{
    /*
        {
            "country": "BG",
            "validFrom": "2025-03-19T06:18:33",
            "validTo": "2026-03-18T23:59:59",
            "vignetteNumber": "25031945034474",
            "vehicleClass": "Превозно средство <= 3,5 тона"
        }
    */
    public function __construct(
        public string $country,
        public ?Carbon $valid_from = null,
        public ?Carbon $valid_to = null,
        public ?string $vignette_number = null,
        public ?string $vehicle_class = null,
        /** Raw decoded array for auditing */
        public array $raw_response = [],
    ) {
        //
    }

    public function toPersistenceArray(): array
    {
        return [
            'country' => $this->country,
            'valid_from' => $this->valid_from?->toDateString(),
            'valid_to' => $this->valid_to?->toDateString(),
            'vignette_number' => $this->vignette_number,
            'vehicle_class' => $this->vehicle_class,
            'raw_response' => $this->raw_response,
        ];
    }
}

