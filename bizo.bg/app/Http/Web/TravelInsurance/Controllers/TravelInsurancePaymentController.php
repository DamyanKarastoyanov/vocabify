<?php

namespace App\Http\Web\TravelInsurance\Controllers;

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceOffer;
use Domain\Axiom\TravelInsurance\Requests\AxiomTravelInsurancePaymentRequest;
use Domain\Payment\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class TravelInsurancePaymentController
{
    public function __invoke(
        AxiomTravelInsurancePaymentRequest $request,
        AxiomTravelInsuranceOffer $offer,
        PaymentService $paymentService
    ): JsonResponse
    {
        //$installment = $offer->policy->pendingInstallment();
        // we always need the first installment as this is the order page!
        $installment = $offer->policy->installments()->first();

        if ($installment->payment && $installment->payment->isVerified()) {
            return response()->json(['error' => 'Вноската по полицата вече е платена!'], 422);
        }

        $newOrderNumber = Str::uuid()->toString();
        $offer->update(['order_number' => $newOrderNumber]);
        $orderNumber = $newOrderNumber;
        $amount = $installment->amount_due * 100; // Convert to cents
        $currency = $installment->currency->axiom_id;

        $result = $paymentService->register($orderNumber, $amount, $currency, route('travel-insurance.payment.callback'), $offer->user_id);

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
