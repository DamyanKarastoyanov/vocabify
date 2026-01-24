<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Exceptions\ApiValidationException;
use App\Facades\MTPLInsuranceGateway;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceOfferRequestDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceVehicleDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceOfferRequestPolicyDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceInsuredDTO;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceCalculateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;

class MTPLInsuranceCalculateController
{
    public function __invoke(BroqeeMTPLInsuranceCalculateRequest $request): JsonResource|JsonResponse
    {
        $allData = $request->all();
        
        $vehicleData = $allData['vehicle'] ?? [];
        $insuredData = $allData['insured'] ?? [];
        $policyData = $allData['policy'] ?? [];

        $dto = new MTPLInsuranceOfferRequestDTO(
            vehicle: MTPLInsuranceVehicleDTO::from($vehicleData),
            insured: MTPLInsuranceInsuredDTO::from($insuredData),
            policy: MTPLInsuranceOfferRequestPolicyDTO::from($policyData),
        );

        try {
            $calculationId = MTPLInsuranceGateway::calculateMTPL($dto);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        }

        Cache::put('mtpl_calculation_' . $calculationId, json_encode($allData), now()->addDays(1));

        return new JsonResource([
            'calculation_id' => $calculationId,
        ]);
    }
}

