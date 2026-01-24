<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Exceptions\ApiLogicalException;
use App\Exceptions\ApiValidationException;
use App\Facades\MTPLInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Actions\CreateCardPaymentAction;
use Domain\Payment\Actions\NotifyCardPaymentFailureAction;
use Domain\Payment\Actions\NotifyCardPaymentSuccessAction;
use Domain\Payment\Jobs\GenerateInstallmentDebitNoteJob;
use Domain\Payment\Models\Installment;
use Domain\Payment\Models\PaymentStatus;
use Domain\Payment\Services\PaymentService;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Response;
use Domain\Insurance\Events\PolicyManualReviewRequiredEvent;

class MTPLInsurancePaymentCallbackController
{
    public function __invoke(
        Request $request,
        PaymentService $paymentService,
        CreateCardPaymentAction $createCardPaymentAction,
        NotifyCardPaymentSuccessAction $notifyCardPaymentSuccessAction,
        NotifyCardPaymentFailureAction $notifyCardPaymentFailureAction
    ): Response|RedirectResponse
    {
        $gateway_order_id = $request->query('orderId');

        $installment = Installment::where('order_number', $gateway_order_id)->first();
        if (!$installment) {
            return redirect()->route('mtpl-insurance', ['step' => 5, 'errors' => ['message' => 'Поръчката не е намерена.']]);
        }
        $offer = $installment->policy->insurable;

        $result = $paymentService->getOrderStatus($gateway_order_id);

        if ($result['status'] === 'error') {
            $notifyCardPaymentFailureAction->handle($installment, $result['message'] ?? '');
            return redirect()->route('mtpl-insurance', ['step' => 5, 'errors' => ['message' => $result['message']]]);
        }

        $installment->update([
            'order_number' => $gateway_order_id
        ]);

        $cardPayment = $createCardPaymentAction->handle([
            'user_id' => $offer->user_id,
            'reference_number' => $gateway_order_id,
            'amount' => $installment->amount_due * 100,
            'axiom_currency_id' => $installment->axiom_currency_id,
            'payment_status_id' => PaymentStatus::STATUSES['VERIFIED'],
        ]);

        $installment->payment()->associate($cardPayment);
        $installment->save();

        try {
            // sigh, debug hardcoded offer id here - 29
            //$issueRequest = MTPLInsuranceGateway::issuePolicy(29);
            $issueRequest = MTPLInsuranceGateway::issuePolicy($offer->broqee_order_number);
        } catch (ApiLogicalException|ApiValidationException $e) {
            $installment->policy->fill([
                'user_id' => $offer->user_id,
                'policy_status_id' => PolicyStatus::STATUSES['MANUAL_REVIEW'],
            ]);
            $installment->policy->save();

            PolicyManualReviewRequiredEvent::dispatch($installment->policy);

            // fake success scenario
            return Inertia::render('mtpl-insurance/mtpl-insurance', [
                'mtpl_insurance' => [
                    'status' => 'success',
                    'order_number' => $offer->order_number,
                    'policy' => [
                        'id' => $installment->policy->id,
                        'policy_number' => $installment->policy->payment_reference ?? '-',
                        'start_date' => $installment->policy->start_date,
                        'end_date' => $installment->policy->end_date,
                        'total_amount' => $installment->policy->total_amount,
                        'status' => $installment->policy->policy_status_id,
                        'installments' => array_map(fn($inst) => [
                            'number' => $inst['sequence'],
                            'total_amount' => $inst['amount_due'],
                        ], $installment->policy->installments->toArray()),
                    ],
                    'debit_note_url' => URL::temporarySignedRoute(
                        'installments.download',
                        now()->addMinutes(30),
                        ['installment' => $installment->id]
                    ),
                    'currency' => $installment->currency->axiom_id,
                    'step' => 6,
                ],
            ]);
        }

        $offer->update([
            'status' => BroqeeMTPLInsuranceOffer::STATUSES['POLICY_ISSUED'],
        ]);

        $installment->policy->fill([
            'user_id' => $offer->user_id,
            'policy_status_id' => PolicyStatus::STATUSES['PENDING_INSURER_CONFIRMATION'],
        ]);
        $installment->policy->save();

        GenerateInstallmentDebitNoteJob::dispatch($installment->id);

        $notifyCardPaymentSuccessAction->handle($cardPayment);

        return Inertia::render('mtpl-insurance/mtpl-insurance', [
            'mtpl_insurance' => [
                'status' => 'success',
                'order_number' => $offer->order_number,
                'policy' => [
                    'id' => $installment->policy->id,
                    'policy_number' => $installment->policy->payment_reference,
                    'installments' => array_map(fn($inst) => [
                        'number' => $inst['sequence'],
                        'total_amount' => $inst['amount_due'],
                    ], $installment->policy->installments->toArray()),
                ],
                'debit_note_url' => URL::temporarySignedRoute(
                    'installments.download',
                    now()->addMinutes(30),
                    ['installment' => $installment->id]
                ),
                'currency' => $installment->currency->axiom_id,
                'step' => 6,
            ],
        ]);
    }
}
