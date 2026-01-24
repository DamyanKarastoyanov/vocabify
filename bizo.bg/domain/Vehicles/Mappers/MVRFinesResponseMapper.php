<?php

namespace Domain\Vehicles\Mappers;

use Carbon\Carbon;
use Domain\Vehicles\DataTransferObjects\MVRFinesCheckDTO;
use Domain\Vehicles\DataTransferObjects\MVRFinesObligationDTO;

final class MVRFinesResponseMapper
{
    public function map(array $proxyResponse): MVRFinesCheckDTO
    {
        $data = $proxyResponse['data'] ?? [];
        $innerData = $data['data'] ?? $data;

        $egn = $data['egn'] ?? '';
        $drivingLicenceNumber = $data['drivingLicenceNumber'] ?? $data['driving_licence_number'] ?? '';

        $obligations = [];
        if (isset($innerData['obligations']) && is_array($innerData['obligations'])) {
            foreach ($innerData['obligations'] as $obligationData) {
                $obligations[] = $this->mapObligation($obligationData);
            }
        }

        $hasObligations = (bool)($innerData['hasObligations'] ?? $innerData['has_obligations'] ?? count($obligations) > 0);

        $totals = $innerData['totals'] ?? [];
        $totalAmountBgn = (float)($totals['amountBGN'] ?? $totals['amountBgn'] ?? $totals['amount_bgn'] ?? 0);
        $totalAmountEur = (float)($totals['amountEUR'] ?? $totals['amountEur'] ?? $totals['amount_eur'] ?? 0);

        return new MVRFinesCheckDTO(
            egn: $egn,
            driving_licence_number: $drivingLicenceNumber,
            has_obligations: $hasObligations,
            total_amount_bgn: $totalAmountBgn,
            total_amount_eur: $totalAmountEur,
            obligations: $obligations,
            raw_response: $proxyResponse
        );
    }

    private function mapObligation(array $obligationData): MVRFinesObligationDTO
    {
        return new MVRFinesObligationDTO(
            document_number: $obligationData['documentNumber'] ?? $obligationData['document_number'] ?? null,
            document_type: $obligationData['documentType'] ?? $obligationData['document_type'] ?? null,
            issue_date: $this->parseDate($obligationData['issueDate'] ?? $obligationData['issue_date'] ?? null),
            is_served: $this->parseBoolean($obligationData['isServed'] ?? $obligationData['is_served'] ?? false),
            reg_number: $obligationData['vehicleNumber'] ?? $obligationData['registrationNumber'] ?? $obligationData['registration_number'] ?? null,
            violation_date: $this->parseDate($obligationData['breachDate'] ?? $obligationData['violationDate'] ?? $obligationData['violation_date'] ?? null),
            violation: $obligationData['breachOfOrder'] ?? $obligationData['violation'] ?? null,
            amount_bgn: $this->parseAmount($obligationData['amount'] ?? $obligationData['amountBgn'] ?? $obligationData['amount_bgn'] ?? 0),
            discount_bgn: $this->parseAmount($obligationData['discountAmount'] ?? $obligationData['discountBgn'] ?? $obligationData['discount_bgn'] ?? 0),
            amount_to_pay_bgn: $this->parseAmount($obligationData['amountToPay'] ?? $obligationData['amountToPayBgn'] ?? $obligationData['amount_to_pay_bgn'] ?? 0),
            amount_eur: $this->parseAmount($obligationData['amountEUR'] ?? $obligationData['amountEur'] ?? $obligationData['amount_eur'] ?? 0),
            valid_until: $this->parseDate($obligationData['expirationDate'] ?? $obligationData['validUntil'] ?? $obligationData['valid_until'] ?? null),
            obligation_date: $this->parseDate($obligationData['obligationDate'] ?? $obligationData['obligation_date'] ?? null),
        );
    }

    private function parseDate(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        $value = preg_replace('/\s+г\.?\s*$/', '', trim($value));

        try {
            return Carbon::parse($value);
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function parseBoolean($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            $lower = strtolower(trim($value));
            return in_array($lower, ['true', '1', 'yes', 'да', 'y']);
        }

        return (bool)$value;
    }

    private function parseAmount($value): float
    {
        if (is_numeric($value)) {
            return (float)$value;
        }

        if (is_string($value)) {
            $value = preg_replace('/[^\d.,-]/', '', $value);
            $value = str_replace(',', '.', $value);
            return (float)$value;
        }

        return 0.0;
    }
}

