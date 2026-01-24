<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceCreatePolicyRequest;
use Domain\Payment\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class MTPLInsurancePaymentController
{
    public function __invoke(
        BroqeeMTPLInsuranceCreatePolicyRequest $request,
        PaymentService $paymentService
    ): JsonResponse
    {
        $offer_id = $request->validated()['offer_id'];
        $offer = BroqeeMTPLInsuranceOffer::findOrFail($offer_id);

        $installment = $offer->policy->installments()->first();

        if ($installment->payment && $installment->payment->isVerified()) {
            return response()->json(['error' => 'Вноската по полицата вече е платена!'], 422);
        }

        $newOrderNumber = Str::uuid()->toString();
        $offer->update(['order_number' => $newOrderNumber]);
        $orderNumber = $newOrderNumber;
        $amount = $installment->amount_due * 100; // Convert to cents
        $currency = $installment->currency->axiom_id;

        $result = $paymentService->register($orderNumber, $amount, $currency, route('mtpl-insurance.payment.callback'), $offer->user_id);

        if ($result['status'] === 'error') {
            return response()->json(['error' => $result['message']], 422);
        }

        $installment->update([
            'order_number' => $result['order_id']
        ]);

        return response()->json([
            'success' => true,
            'redirect_url' => $result['redirect_url'],
        ]);
    }
}

/*

    fetch("http://local.bizo.bg/mtpl-insurance/payment", {
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
