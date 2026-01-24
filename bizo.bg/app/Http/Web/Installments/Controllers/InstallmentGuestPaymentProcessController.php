<?php

namespace App\Http\Web\Installments\Controllers;

use Domain\Payment\Actions\CreateBankTransferAction;
use Domain\Payment\Actions\NotifyBankTransferInitiationAction;
use Domain\Payment\Models\Installment;
use Domain\Payment\Models\PaymentStatus;
use Domain\Payment\Requests\InstallmentGuestPaymentProcessRequest;
use Domain\Payment\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class InstallmentGuestPaymentProcessController
{
    public function __invoke(
        InstallmentGuestPaymentProcessRequest $request,
        Installment $installment,
        PaymentService $paymentService,
        CreateBankTransferAction $createBankTransferAction,
        NotifyBankTransferInitiationAction $notifyBankTransferInitiationAction
    ): JsonResponse {
        $guestPayment = $request->guestPayment;

        $newOrderNumber = Str::uuid()->toString();
        $installment->update(['order_number' => $newOrderNumber]);
        $orderNumber = $newOrderNumber;
        $amount = $installment->amount_due * 100;
        $currency = $installment->currency->axiom_id;

        $paymentType = $request->input('payment_type', 'card_payment');

        if ($paymentType === 'bank_transfer') {
            $bankTransfer = $createBankTransferAction->handle([
                'user_id' => $installment->policy->user_id,
                'reference_number' => $orderNumber,
                'amount' => $installment->amount_due * 100,
                'axiom_currency_id' => $installment->currency->id,
                'payment_status_id' => PaymentStatus::STATUSES['PENDING'],
            ]);

            $installment->payment()->associate($bankTransfer);
            $installment->save();

            $notifyBankTransferInitiationAction->handle($installment);

            return response()->json([
                'success' => true,
                'payment_details' => config('debit-note.bank'),
                'policy_number' => $installment->policy->policy_number,
                'currency' => $installment->currency->axiom_id,
                'current_installment_amount' => $installment->amount_due,
                'current_installment_sequence' => $installment->sequence,
                'installments_count' => $installment->policy->installments->count(),
            ]);
        }

        $result = $paymentService->register($orderNumber, $amount, $currency, route('installments.guest-payment.callback'), $installment->policy->user_id);
 
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
