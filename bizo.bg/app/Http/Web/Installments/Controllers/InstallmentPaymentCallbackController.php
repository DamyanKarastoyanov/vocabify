<?php

namespace App\Http\Web\Installments\Controllers;

use Domain\Payment\Actions\CreateCardPaymentAction;
use Domain\Payment\Actions\NotifyCardPaymentFailureAction;
use Domain\Payment\Models\Installment;
use Domain\Payment\Models\PaymentStatus;
use Domain\Payment\Jobs\GenerateInstallmentDebitNoteJob;
use Domain\Payment\Requests\InstallmentPaymentCallbackRequest;
use Domain\Payment\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\URL;
use Inertia\Response;

class InstallmentPaymentCallbackController
{
    public function __invoke(
        InstallmentPaymentCallbackRequest $request,
        PaymentService $paymentService,
        CreateCardPaymentAction $createCardPaymentAction,
        NotifyCardPaymentFailureAction $notifyCardPaymentFailureAction
    ): Response|RedirectResponse
    {
        $orderId = $request->query('orderId');

        $installment = Installment::where('order_number', $orderId)->firstOrFail();

        $result = $paymentService->getOrderStatus($orderId);

        if ($result['status'] === 'error') {
            $notifyCardPaymentFailureAction->handle($installment, $result['message'] ?? '');
            return redirect()->route('installments.index', ['installmentId' => $installment->id, 'step' => 'payment', 'errors' => ['message' => $result['message']]]);
        }

        $cardPayment = $createCardPaymentAction->handle([
            'user_id' => $installment->policy->user_id,
            'reference_number' => $orderId,
            'amount' => $installment->amount_due * 100,
            'axiom_currency_id' => $installment->axiom_currency_id,
            'payment_status_id' => PaymentStatus::STATUSES['VERIFIED'],
        ], true);

        $installment->payment()->associate($cardPayment);
        $installment->save();

        GenerateInstallmentDebitNoteJob::dispatch($installment->id);

        return redirect()->route('installments.index', [
            'installmentId' => $installment->id,
            'policy_number' => $installment->policy->policy_number,
            'current_installment_amount' => $installment->amount_due,
            'current_installment_sequence' => $installment->sequence,
            'installments_count' => $installment->policy->installments->count(),
            'debit_note_url' => URL::temporarySignedRoute(
                'installments.download',
                now()->addMinutes(30),
                ['installment' => $installment->id]
            ),
            'currency' => $installment->currency->axiom_id,
            'status' => 'success',
        ]);
    }
}
