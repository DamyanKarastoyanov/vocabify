<?php

namespace Domain\Vehicles\Mappers;

use Carbon\Carbon;
use Domain\Vehicles\DataTransferObjects\VignetteDTO;

final class VignetteResponseMapper
{
    public function map(array $proxyResponse, string $country): VignetteDTO
    {
        // Support both your current "transformed" shape and raw proxy shape
        $data = $proxyResponse['data'] ?? [];
        $inner = $data['data'] ?? [];
        $info = $inner['vignetteInfo'] ?? [];

        // Dates: prefer ISO keys, fallback to non-ISO
        $validFrom = $this->parseDate($info['validFromISO'] ?? $info['validFrom'] ?? null);
        $validTo = $this->parseDate($info['validToISO'] ?? $info['validTo'] ?? null);

        return new VignetteDTO(
            country: $country,
            valid_from: $validFrom,
            valid_to: $validTo,
            vignette_number: $info['vignetteNumber'] ?? null,
            vehicle_class: $info['vehicleClass'] ?? $info['vehicleType'] ?? null,
            raw_response: $proxyResponse
        );
    }

    private function parseDate(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }
        try {
            return Carbon::parse($value);
        } catch (\Throwable $e) {
            return null;
        }
    }
}

