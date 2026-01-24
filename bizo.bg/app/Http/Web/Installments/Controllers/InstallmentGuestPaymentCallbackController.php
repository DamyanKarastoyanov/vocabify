<?php

namespace App\Http\Web\Installments\Controllers;

use Domain\Insurance\Models\InsuranceType;
use Domain\Payment\Actions\CreateCardPaymentAction;
use Domain\Payment\Actions\NotifyCardPaymentFailureAction;
use Domain\Payment\Models\Installment;
use Domain\Payment\Models\InstallmentGuestPayment;
use Domain\Payment\Models\PaymentStatus;
use Domain\Payment\Requests\InstallmentGuestPaymentCallbackRequest;
use Domain\Payment\Jobs\GenerateInstallmentDebitNoteJob;
use Domain\Payment\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Response;

class InstallmentGuestPaymentCallbackController
{
    public function __invoke(
        InstallmentGuestPaymentCallbackRequest $request,
        PaymentService $paymentService,
        CreateCardPaymentAction $createCardPaymentAction,
        NotifyCardPaymentFailureAction $notifyCardPaymentFailureAction
    ): Response|RedirectResponse {
        $orderId = $request->query('orderId');

        $installment = Installment::where('order_number', $orderId)->firstOrFail();

        $guestPayment = $installment->guestPayment;

        if (!$guestPayment) {
            abort(404, 'Линка за плащане не е намерен.');
        }

        $result = $paymentService->getOrderStatus($orderId);

        if ($result['status'] === 'error') {
            $notifyCardPaymentFailureAction->handle($installment, $result['message'] ?? '');
            return redirect()->route('installments.guest-payment', [
                'token' => $guestPayment->token,
                'errors' => ['message' => $result['message']],
            ]);
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

        return redirect()->route('installments.guest-payment', [
            'token' => $guestPayment->token,
            'status' => 'success',
            'step' => 2,
            'payment_type' => 'card_payment',
            'current_installment_amount' => $installment->amount_due,
            'current_installment_sequence' => $installment->sequence,
            'installments_count' => $installment->policy->installments->count(),
            'debit_note_url' => URL::temporarySignedRoute(
                'installments.download',
                now()->addMinutes(30),
                ['installment' => $installment->id]
            ),
            'currency' => $installment->currency->axiom_id,
            'policy_url' => $this->getPolicyDownloadUrl($installment),
        ]);
    }

    private function getPolicyDownloadUrl(Installment $installment): ?string
    {
        $policy = $installment->policy;

        if (!$policy?->isDownloadable() || !$policy->insurable) {
            return null;
        }

        $routeName = match ($policy->insuranceType->code) {
            InsuranceType::TYPES['HOME'] => 'home-insurance.download-policy',
            InsuranceType::TYPES['TRAVEL'] => 'travel-insurance.download-policy',
            InsuranceType::TYPES['NONRES'] => 'non-resident-insurance.download-policy',
            InsuranceType::TYPES['MTPL'] => 'mtpl-insurance.download-policy',
            default => null,
        };

        if (!$routeName) {
            return null;
        }

        return URL::temporarySignedRoute(
            $routeName,
            now()->addMinutes(30),
            ['policy' => $policy->insurable->id]
        );
    }
}
