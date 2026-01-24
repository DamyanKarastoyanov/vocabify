<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use App\Exceptions\ApiLogicalException;
use App\Exceptions\ApiValidationException;
use App\Facades\HomeInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\HomeInsurance\Actions\CreateHomeInsurancePolicyAction;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsurancePolicyDTO;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsuranceOffer;
use Domain\Axiom\HomeInsurance\Requests\AxiomHomeInsuranceCreatePolicyRequest;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Actions\CreateBankTransferAction;
use Domain\Payment\Actions\NotifyBankTransferInitiationAction;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeInsuranceCreatePolicyController
{
    public function __invoke(
        AxiomHomeInsuranceCreatePolicyRequest $request,
        CreateHomeInsurancePolicyAction $createHomeInsurancePolicyAction,
        CreateBankTransferAction $createBankTransferAction,
        NotifyBankTransferInitiationAction $notifyBankTransferInitiationAction
    ): JsonResource|JsonResponse
    {
        $offer_id = $request->validated()['offer_id'];
        $axiom_offer = AxiomHomeInsuranceOffer::find($offer_id);
        $axiom_offer_id = $axiom_offer->axiom_id;

        try {
            $policy = HomeInsuranceGateway::createPolicy($axiom_offer_id);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        } catch (ApiLogicalException $e) {
            return response()->json([
                'message' => "Неуспешно създаване на полица",
                'errors' => [],
            ], $e->getCode() ?: 500);
        }

        $policyDTO = HomeInsurancePolicyDTO::from($policy);

        $policyModel = $createHomeInsurancePolicyAction->handle([
            'user_id' => $axiom_offer->user_id,
            'axiom_id' => $policyDTO->id,
            'axiom_offer_id' => $offer_id,
            'policy_number' => $policyDTO->policy_number,
            'api_response_json' => json_encode($policy),
            'axiom_district_id' => AxiomDistrict::where('axiom_id', $policyDTO->property->district_id)->first()->id ?? null,
            'axiom_municipality_id' => AxiomMunicipality::where('axiom_id', $policyDTO->property->municipality_id)->first()->id ?? null,
            'axiom_town_id' => AxiomTown::where('axiom_id', $policyDTO->property->town_id)->first()->id ?? null,
            'property_town_type' => $policyDTO->property->town_type,
            'property_address' => $policyDTO->property->address,
            'property_postal_code' => $policyDTO->property->post_code,
            'total_amount' => $policyDTO->total_amount,
            'axiom_currency_id' => AxiomCurrency::where('axiom_id', $policyDTO->currency)->firstOrFail()->id,
            'start_date' => $policyDTO->start_date,
            'end_date' => $policyDTO->end_date,
            'axiom_policy_status_id' => $policyDTO->status->id,
        ]);

        $installment = $axiom_offer->policy->installments()->first();

        $bankTransfer = $createBankTransferAction->handle([
            'user_id' => $axiom_offer->user_id,
            'reference_number' => $axiom_offer->order_number,
            'amount' => $installment->amount_due * 100,
            'axiom_currency_id' => $axiom_offer->axiom_currency_id,
            'payment_status_id' => PaymentStatus::STATUSES['PENDING'],
        ]);

        $installment->payment()->associate($bankTransfer);
        $installment->save();

        $installment->policy->insurable()->associate($policyModel);
        $installment->policy->fill([
            'user_id' => $axiom_offer->user_id,
            'policy_number' => $policyDTO->policy_number,
            'start_date' => $policyDTO->start_date,
            'end_date' => $policyDTO->end_date,
            'title' => $policyModel->title,
            'axiom_policy_status_id' => $policyDTO->status->id,
            'policy_status_id' => PolicyStatus::STATUSES['AWAITING_PAYMENT_CONFIRMATION'],
        ]);
        $installment->policy->save();

        $notifyBankTransferInitiationAction->handle($installment);

        $policyDTO->id = $policyModel->id;

        $responseData = $policyDTO->toArray();
        $responseData['payment_details'] = config('debit-note.bank');

        return new JsonResource($responseData);
    }
}

/*
fetch("http://local.bizo.bg/home-insurance/create-policy", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  "referrer": "http://local.bizo.bg/home-insurance",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"offer_id\":904}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

*/


