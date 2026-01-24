<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Enums\VehicleCreationSource;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Actions\CreateVehicleInspectionAction;
use Domain\Vehicles\Actions\CreateVehicleSpecificationAction;
use Domain\Vehicles\Services\VehicleResolverService;

class CreateVehicleFromInspectionDataAction
{
    public function __construct(
        private VehicleResolverService $vehicleResolverService,
        private CreateVehicleInspectionAction $createVehicleInspectionAction,
        private CreateVehicleSpecificationAction $createVehicleSpecificationAction,
    ) {}

    public function handle(array $response): ?Vehicle
    {
        $data = $response['data'] ?? [];

        // Extract inspection data from nested structure
        $inspectionData = $data['inspectionData'] ?? [];
        $found = $data['found'] ?? false;

        // Map nested inspection data to expected format
        $mappedData = [
            'registration_number' => $inspectionData['registrationNumber'] ?? $data['registration_number'] ?? null,
            'vehicle_identification' => $inspectionData['identificationNumber'] ?? null,
            'next_inspection_date' => $this->parseInspectionDate($inspectionData['nextInspectionDate'] ?? null),
            'is_valid' => $inspectionData['isValid'] ?? false,
            'is_periodic' => $inspectionData['isPeriodic'] ?? false,
            'eco_category' => $inspectionData['ecoCategory'] ?? null,
        ];

        $vehicle = $this->vehicleResolverService->resolveVehicle([
            'vin' => $mappedData['vehicle_identification'],
            'reg_number' => $mappedData['registration_number'],
        ], VehicleCreationSource::INSPECTION);

        // Only create inspection record if inspection data was found
        if ($found && isset($inspectionData['nextInspectionDate'])) {
            $this->createVehicleInspectionAction->handle($vehicle, [
                'next_inspection_date' => $mappedData['next_inspection_date'],
                'is_valid' => $mappedData['is_valid'],
                'is_periodic' => $mappedData['is_periodic'],
                'raw_response' => $response,
            ]);
        }

        $this->createVehicleSpecificationAction->handle($vehicle, [
            'euro_standard' => $mappedData['eco_category'],
        ]);

        return $vehicle->load(['inspection', 'specification']);
    }

    /**
     * Parse inspection date from DD.MM.YYYY format to YYYY-MM-DD
     */
    private function parseInspectionDate(?string $date): ?string
    {
        if (!$date) {
            return null;
        }

        // Handle DD.MM.YYYY format
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})$/', $date, $matches)) {
            return sprintf('%s-%s-%s', $matches[3], $matches[2], $matches[1]);
        }

        // If already in YYYY-MM-DD format, return as-is
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $date;
        }

        // Try to parse as date and format
        try {
            $parsed = \Carbon\Carbon::createFromFormat('d.m.Y', $date);
            return $parsed->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
