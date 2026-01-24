<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Exceptions\ApiLogicalException;
use App\Exceptions\ApiValidationException;
use App\Facades\MTPLInsuranceGateway;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceCreatePolicyRequest;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Actions\CreateBankTransferAction;
use Domain\Payment\Actions\NotifyBankTransferInitiationAction;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

class MTPLInsuranceCreatePolicyController
{
    public function __invoke(
        BroqeeMTPLInsuranceCreatePolicyRequest $request,
        CreateBankTransferAction $createBankTransferAction,
        NotifyBankTransferInitiationAction $notifyBankTransferInitiationAction
    ): JsonResource|JsonResponse
    {
        $offer_id = $request->validated()['offer_id'];
        $offer = BroqeeMTPLInsuranceOffer::findOrFail($offer_id);


        try {
            // sigh, debug hardcoded offer id here - 29
            // $issueRequest = MTPLInsuranceGateway::issuePolicy(29);
            $issueRequest = MTPLInsuranceGateway::issuePolicy($offer->broqee_order_number);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        } catch (ApiLogicalException $e) {
            return response()->json([
                'message' => "Неуспешно създаване на полица",
                'errors' => [],
            ], $e->getCode() ?: 500);
        }

        $offer->update([
            'status' => BroqeeMTPLInsuranceOffer::STATUSES['POLICY_ISSUED'],
        ]);

        $installment = $offer->policy->installments()->first();

        $bankTransfer = $createBankTransferAction->handle([
            'user_id' => $offer->user_id,
            'reference_number' => $offer->order_number,
            'amount' => $installment->amount_due * 100,
            'axiom_currency_id' => $installment->axiom_currency_id,
            'payment_status_id' => PaymentStatus::STATUSES['PENDING'],
        ]);

        $installment->payment()->associate($bankTransfer);
        $installment->save();

        $installment->policy->fill([
            'user_id' => $offer->user_id,
            'policy_status_id' => PolicyStatus::STATUSES['PENDING_INSURER_CONFIRMATION'],
        ]);
        $installment->policy->save();

        $notifyBankTransferInitiationAction->handle($installment);

        $responseData = [
            'success' => true,
            'order_number' => $offer->order_number,
            'policy_number' => $installment->policy->payment_reference,
            'currency' => $installment->currency->axiom_id,
            'installments' => [
                [
                    'total_amount' => $installment->amount_due,
                    'sequence' => 1,
                ]
            ],
            'payment_details' => config('debit-note.bank'),
        ];


        return new JsonResource($responseData);
    }
}

/*

    fetch("http://local.bizo.bg/mtpl-insurance/create-policy", {
    "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    "referrer": "http://local.bizo.bg/home-insurance",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"offer\": 10}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
    });

*/


