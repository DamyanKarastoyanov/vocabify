<?php

namespace App\Http\Web\TravelInsurance\Controllers;

use App\Exceptions\ApiLogicalException;
use App\Exceptions\ApiValidationException;
use App\Facades\TravelInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Axiom\TravelInsurance\Actions\CreateTravelInsurancePolicyAction;
use Domain\Axiom\TravelInsurance\DataTransferObjects\TravelInsurancePolicyDTO;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceDestination;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceOffer;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelTypeActivity;
use Domain\Axiom\TravelInsurance\Requests\AxiomTravelInsuranceCreatePolicyRequest;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Actions\CreateBankTransferAction;
use Domain\Payment\Actions\NotifyBankTransferInitiationAction;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

class TravelInsuranceCreatePolicyController
{
    public function __invoke(
        AxiomTravelInsuranceCreatePolicyRequest $request,
        CreateTravelInsurancePolicyAction $createTravelInsurancePolicyAction,
        CreateBankTransferAction $createBankTransferAction,
        NotifyBankTransferInitiationAction $notifyBankTransferInitiationAction
    ): JsonResource|JsonResponse
    {
        $offer_id = $request->validated()['offer_id'];
        $axiom_offer = AxiomTravelInsuranceOffer::find($offer_id);
        $axiom_offer_id = $axiom_offer->axiom_id;

        try {
            $policy = TravelInsuranceGateway::createPolicy($axiom_offer_id);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        } catch (ApiLogicalException $e) {
            return response()->json([
                'message' => "Неуспешно създаване на полица",
                'errors' => [],
            ], $e->getCode() ?: 500);
        }

        $policyDTO = TravelInsurancePolicyDTO::from($policy);
        $travelTypeId = AxiomTravelInsuranceTravelType::where('axiom_id', $policyDTO->travel_type_id)->first()?->id ?? null;

        $policyModel = $createTravelInsurancePolicyAction->handle([
            'user_id' => 1,
            'axiom_id' => $policyDTO->id,
            'axiom_offer_id' => $offer_id,
            'policy_number' => $policyDTO->policy_number,
            'api_response_json' => json_encode($policy),
            'axiom_travel_insurance_destination_id' => AxiomTravelInsuranceDestination::where('axiom_id', $policyDTO->territorial_coverage_id)->first()?->id ?? null,
            'axiom_travel_insurance_travel_type_id' => $travelTypeId,
            'axiom_travel_insurance_travel_type_activity_id' => AxiomTravelInsuranceTravelTypeActivity::where('axiom_id', $policyDTO->travel_type_activity_id)->where('travel_type_id', $travelTypeId)->first()?->id ?? null,
            'total_amount' => $policyDTO->total_amount,
            'axiom_currency_id' => AxiomCurrency::where('axiom_id', $policyDTO->currency)->firstOrFail()->id,
            'start_date' => $policyDTO->start_date,
            'end_date' => $policyDTO->end_date,
            'axiom_policy_status_id' => AxiomPolicyStatus::where('id', $policyDTO->policy_status_id)->firstOrFail()->id,
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
            'axiom_policy_status_id' => $policyModel->axiom_policy_status_id,
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


fetch("http://local.bizo.bg/travel-insurance/create-policy", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
    offer_id: 1071,
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});


*/


