<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Facades\MTPLInsuranceGateway;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsurancePersonDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceRequiredFieldDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceVehicleDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceVehiclePersonDataDTO;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceGetVehiclePersonDataRequest;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class MTPLInsuranceGetVehiclePersonDataController
{
    public function __invoke(BroqeeMTPLInsuranceGetVehiclePersonDataRequest $request): JsonResource
    {
        $data = $request->validated();
        $number = $data['number'];
        $talon = $data['talon'];
        
        $vehicleResponse = MTPLInsuranceGateway::getVehicle($number, $talon);
        $personResponse = MTPLInsuranceGateway::getPerson($number, $talon);
        
        $mergedRequiredFields = array_merge(
            $vehicleResponse['required_fields'] ?? [],
            $personResponse['required_fields'] ?? []
        );

        $requiredFieldsArray = [];
        if (!empty($mergedRequiredFields)) {
            // Handle {"fields": [...]} format
            if (isset($mergedRequiredFields['fields']) && is_array($mergedRequiredFields['fields'])) {
                $requiredFieldsArray = array_map(
                    fn($field) => MTPLInsuranceRequiredFieldDTO::from($field),
                    $mergedRequiredFields['fields']
                );
            } else {
                // Handle associative array format
                foreach ($mergedRequiredFields as $key => $value) {
                    if (is_array($value) && (isset($value['type']) || isset($value['label']))) {
                        $fieldData = $value;
                        $fieldData['field'] = $key;
                        $requiredFieldsArray[] = MTPLInsuranceRequiredFieldDTO::from($fieldData);
                    }
                }
            }
        }

        $vehiclePersonDataDTO = new MTPLInsuranceVehiclePersonDataDTO(
            vehicle: MTPLInsuranceVehicleDTO::from($vehicleResponse['vehicle']),
            person: MTPLInsurancePersonDTO::from($personResponse['person']),
            required_fields: collect($requiredFieldsArray)
        );

        Cache::put('mtpl_vehicle_data_'. $number . "_" .  $talon, json_encode($vehiclePersonDataDTO->vehicle?->toArray() ?? []), now()->addDays(1));

        // Convert required_fields Collection to associative array format for frontend
        $data = $vehiclePersonDataDTO->toArray();
        $requiredFields = [];
        foreach ($data['required_fields'] ?? [] as $field) {
            if (isset($field['field']) && !empty($field['field'])) {
                $fieldArray = $field;
                unset($fieldArray['field']);
                $requiredFields[$field['field']] = $fieldArray;
            }
        }
        $data['required_fields'] = $requiredFields;

        return new JsonResource($data);
    }
}
/*
    fetch("http://local.bizo.bg/mtpl-insurance/vehicle-person-data", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        "referrer": "http://local.bizo.bg/home-insurance",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
            number: "CA7632XA",
            talon: "000021009",
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
*/


