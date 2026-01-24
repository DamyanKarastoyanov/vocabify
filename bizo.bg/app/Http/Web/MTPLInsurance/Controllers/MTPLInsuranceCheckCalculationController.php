<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Exceptions\ApiValidationException;
use App\Facades\MTPLInsuranceGateway;
use Domain\Broqee\MTPLInsurance\Actions\CreateMTPLInsuranceOfferAction;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceOfferDTO;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceCheckCalculationRequest;
use Domain\Users\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;

class MTPLInsuranceCheckCalculationController
{
    public function __invoke(BroqeeMTPLInsuranceCheckCalculationRequest $request, CreateMTPLInsuranceOfferAction $createMTPLInsuranceOfferAction): JsonResource|JsonResponse
    {
        $data = $request->validated();
        $calculationId = $data['calculation_id'];

        try {
            $offers = MTPLInsuranceGateway::checkCalculation($calculationId);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        }

        // Check if calculation is still pending
        $isFinished = $offers['finished'] ?? false;
        $status = $offers['status'] ?? null;

        if (!$isFinished || $status === 'pending' || empty($offers['results'] ?? [])) {
            return new JsonResource([
                'status' => $status ?? 'pending',
                'calculation_id' => $calculationId,
                'finished' => false,
                'results' => [],
            ]);
        }

        // Process results when available - preserve structure, only add database IDs
        $results = $offers['results'] ?? [];
        $apiRequestDTOJson = Cache::get('mtpl_calculation_' . $calculationId);

        foreach ($results as $key => $offer) {
            // Filter out incomplete offers
            if (!isset($offer['status'], $offer['offer'], $offer['total'], $offer['total_bgn'], $offer['total_eur'], $offer['payments'])) {
                unset($results[$key]);
                continue;
            }

            // Filter out offers without valid prices
            $totalBgn = $offer['total_bgn'] ?? null;
            if (empty($totalBgn) || $totalBgn === '0' || $totalBgn === '0.00' || !is_numeric($totalBgn) || (float)$totalBgn <= 0) {
                unset($results[$key]);
                continue;
            }

            $offerDTO = MTPLInsuranceOfferDTO::from($offer);

            $createdOffer = $createMTPLInsuranceOfferAction->handle([
                'offer' => $offerDTO->offer,
                'status' => BroqeeMTPLInsuranceOffer::STATUSES['PENDING'],
                'total' => $offerDTO->total,
                'total_bgn' => $offerDTO->total_bgn,
                'total_eur' => $offerDTO->total_eur,
                'payments' => $offerDTO->payments,
                'user_id' => User::SYSTEM_USER_ID,
                'api_request_dto_json' => $apiRequestDTOJson,
            ]);

            // Add database ID to the offer, preserve original structure
            $results[$key]['id'] = $createdOffer->id;
        }

        $offers['results'] = $results;

        return new JsonResource([
            'status' => 'completed',
            'calculation_id' => $calculationId,
            'finished' => true,
            'results' => $offers['results'],
        ]);
    }
}

