<?php

namespace App\Http\Web\NonResidentInsurance\Controllers;

use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceOffer;
use Domain\Axiom\NonResidentInsurance\Requests\AxiomNonResidentInsurancePaymentRequest;
use Domain\Payment\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class NonResidentInsurancePaymentController
{
    public function __invoke(
        AxiomNonResidentInsurancePaymentRequest $request,
        AxiomNonResidentInsuranceOffer $offer,
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

        $result = $paymentService->register($orderNumber, $amount, $currency, route('non-resident-insurance.payment.callback'), $offer->user_id);

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
