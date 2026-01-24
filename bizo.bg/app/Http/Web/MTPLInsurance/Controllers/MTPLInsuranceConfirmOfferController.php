<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Exceptions\ApiValidationException;
use App\Facades\MTPLInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceConfirmOfferRequestDTO;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsurancePolicy;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceConfirmOfferRequest;
use Domain\Broqee\MTPLInsurance\Services\PaymentReferenceGeneratorService;
use Domain\Insurance\Actions\CreatePolicyAction;
use Domain\Insurance\Models\InsuranceCompany;
use Domain\Insurance\Models\InsuranceType;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Actions\CreateInstallmentAction;
use Domain\Users\Models\User;
use Domain\Users\Services\UserResolverService;
use Domain\Vehicles\Actions\CreateVehicleFromMTPLDataAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class MTPLInsuranceConfirmOfferController
{
    public function __invoke(
        BroqeeMTPLInsuranceConfirmOfferRequest $request,
        CreatePolicyAction $createPolicyAction,
        CreateInstallmentAction $createInstallmentAction,
        UserResolverService $userResolverService,
        PaymentReferenceGeneratorService $paymentReferenceGeneratorService,
        CreateVehicleFromMTPLDataAction $createVehicleFromMTPLInsuranceDataAction
    ): JsonResource|JsonResponse
    {
        $data = $request->validated();
        $offer = BroqeeMTPLInsuranceOffer::findOrFail($data['offer']);

        $apiRequestData = is_string($offer->api_request_dto_json)
            ? json_decode($offer->api_request_dto_json, true)
            : $offer->api_request_dto_json;

        $nameParts = explode(' ', $data['data']['names'], 2);
        $firstName = $nameParts[0] ?? '';
        $lastName = $nameParts[1] ?? $firstName;

        $driverExperience = $apiRequestData['insured']['xp'] ?? null;
        $wheelDirection = $data['custom_data']['wheel_direction'] ?? null;
        $engineVolume = $data['custom_data']['engine_volume'] ?? null;

        unset($data['custom_data']['wheel_direction']);
        unset($data['custom_data']['engine_volume']);

        $user = $userResolverService->resolveUser($data['data']['email'], [
            'profile' => [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'phone' => $data['data']['phone'],
                'driver_experience_years' => $driverExperience,
            ],
        ]);

        $data['offer'] = $offer->broqee_offer_id;

        $additionalData = [
            'order_id' => $offer->order_number,
            'order_items_id' => $offer->order_number,
        ];

        $data['custom_data'] = array_merge($data['custom_data'], $additionalData);

        $dto = MTPLInsuranceConfirmOfferRequestDTO::from($data);

        try {
            $broqeeOrderNumber = MTPLInsuranceGateway::confirmOffer($dto);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        }


        $vehicleNumber = $apiRequestData['vehicle']['number'] ?? null;
        $vehicleTalon = $apiRequestData['vehicle']['talon'] ?? null;

        $vehicleData = json_decode(Cache::get('mtpl_vehicle_data_'. $vehicleNumber . "_" . $vehicleTalon), true);

        $markName = $vehicleData['mark_name'] ?? '';
        $modelName = $vehicleData['model_name'] ?? '';

        $vehicleModel = $createVehicleFromMTPLInsuranceDataAction->handle([
            'user_id' => $user->id,
            'vin' => $vehicleData['vin'] ?? null,
            'talon' => $vehicleData['talon'] ?? null,
            'reg_number' => $vehicleData['number'] ?? null,
            'year' => $vehicleData['year'],
            'mark_name' => $markName,
            'model_name' => $modelName,
            'engine_volume' => $engineVolume,
            'engine_power_kw' => $vehicleData['engine_power_kw'],
            'wheel_direction' => $wheelDirection,
        ]);

        $offer->update([
            'broqee_order_number' => $broqeeOrderNumber,
            'user_id' => $user->id,
            'status' => BroqeeMTPLInsuranceOffer::STATUSES['CONFIRMED'],
            'vehicle_id' => $vehicleModel ? $vehicleModel->id : null,
        ]);

        $policyTitle = trim("{$vehicleNumber}, {$modelName}, {$markName} ");
        $insuranceType = InsuranceType::firstWhere('code', BroqeeMTPLInsurancePolicy::INSURANCE_TYPE_CODE);
        $startDate = $data['custom_data']['policy_start_date'] ?? null;

        $policy = $createPolicyAction->handle([
            'insurance_type_id' => $insuranceType->id,
            'insurable_id' => $offer->id,
            'insurable_type' => BroqeeMTPLInsuranceOffer::class,
            'start_date' => $startDate,
            'end_date' => $startDate ? Carbon::parse($startDate)->addYear()->toDateString() : null,
            'user_id' => User::SYSTEM_USER_ID,
            'insurance_company_id' => InsuranceCompany::BROQEE_ID,
            'axiom_currency_id' => AxiomCurrency::firstWhere('axiom_id', 'BGN')->id,
            'total_amount' => $offer->total,
            'commission' => $offer->total * $insuranceType->commission_rate / 100,
            'policy_status_id' => PolicyStatus::STATUSES['DRAFT'],
            'title' => $policyTitle ?: null,
        ]);

        $policy->update([
            'payment_reference' => $paymentReferenceGeneratorService->generate($policy),
        ]);

        $offer->payments->each(function ($installment) use ($policy, $createInstallmentAction) {
            $createInstallmentAction->handle([
                'amount_due' => $installment->total,
                'axiom_currency_id' => AxiomCurrency::firstWhere('axiom_id', 'BGN')->id,
                'due_date' => now()->addDays(10 * $installment->number),
                'sequence' => $installment->number,
                'policy_id' => $policy->id,
            ]);
        });

        return new JsonResource([
            'success' => true,
        ]);
    }
}

/*
    fetch("http://local.bizo.bg/mtpl-insurance/confirm-offer", {
        headers: {
            "accept": "application/json",
            "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        referrer: "http://local.bizo.bg/home-insurance",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
                "offer": 1,
                "vehicle": {
                    "vehicle_usage": "1",
                },
                "insured": {
                    "location_id": "18",
                    "insured_names": "Test Testov",
                    "insured_phone": "0888123456",
                    "insured_email": "test@testov.com"
                },
                "policy": {
                    "policy_start_date": "2025-09-10"
                }
            }),
        method: "POST",
        mode: "cors",
        credentials: "include"
    });
*/



