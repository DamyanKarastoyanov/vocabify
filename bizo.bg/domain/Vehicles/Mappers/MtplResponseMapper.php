<?php

namespace Domain\Vehicles\Mappers;

use Carbon\Carbon;
use Domain\Vehicles\DataTransferObjects\MtplCheckDTO;

final class MtplResponseMapper
{
    public function map(array $proxyResponse): MtplCheckDTO
    {
        $data = $proxyResponse['data'] ?? [];
        $details = $data['details'][0] ?? null;

        $startDate = $this->parseDate($details['startDate'] ?? null);
        $endDate = $this->parseDate($details['endDate'] ?? null);

        return new MtplCheckDTO(
            has_valid_insurance: (bool)($data['hasValidInsurance'] ?? false),
            insurer: $details['insurer'] ?? null,
            policy_number: $details['policyNumber'] ?? null,
            start_date: $startDate,
            end_date: $endDate,
            raw_response: $proxyResponse
        );
    }

    private function parseDate(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            $cleaned = trim($value);
            $cleaned = str_replace('г.', '', $cleaned);
            $cleaned = preg_replace('/\s+/', ' ', $cleaned);
            $cleaned = trim($cleaned);

            $datePart = explode(' ', $cleaned)[0];

            if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})$/', $datePart, $matches)) {
                $day = $matches[1];
                $month = $matches[2];
                $year = $matches[3];
                return Carbon::createFromDate($year, $month, $day)->startOfDay();
            }

            return Carbon::parse($cleaned);
        } catch (\Throwable $e) {
            return null;
        }
    }
}

