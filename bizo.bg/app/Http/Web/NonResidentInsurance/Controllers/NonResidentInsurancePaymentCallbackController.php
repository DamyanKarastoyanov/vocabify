<?php

namespace App\Http\Web\NonResidentInsurance\Controllers;

use App\Exceptions\ApiLogicalException;
use App\Exceptions\ApiValidationException;
use App\Facades\NonResidentInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Axiom\NonResidentInsurance\Actions\CreateNonResidentInsurancePolicyAction;
use Domain\Axiom\NonResidentInsurance\DataTransferObjects\NonResidentInsurancePolicyDTO;
use Domain\Axiom\NonResidentInsurance\Requests\AxiomNonResidentInsurancePaymentCallbackRequest;
use Domain\Insurance\Events\PolicyIssuedEvent;
use Domain\Insurance\Events\PolicyManualReviewRequiredEvent;
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
use Illuminate\Support\Facades\URL;
use Inertia\Response;

class NonResidentInsurancePaymentCallbackController
{
    public function __invoke(
        AxiomNonResidentInsurancePaymentCallbackRequest $request,
        PaymentService $paymentService,
        CreateNonResidentInsurancePolicyAction $createNonResidentInsurancePolicyAction,
        CreateCardPaymentAction $createCardPaymentAction,
        NotifyCardPaymentSuccessAction $notifyCardPaymentSuccessAction,
        NotifyCardPaymentFailureAction $notifyCardPaymentFailureAction
    ): Response|RedirectResponse
    {
        $gateway_order_id = $request->query('orderId');

        $installment = Installment::where('order_number', $gateway_order_id)->first();
        if (!$installment) {
            return redirect()->route('non-resident-insurance', ['step' => 3, 'errors' => ['message' => 'Поръчката не е намерена.']]);
        }

        $offer = $installment->policy->insurable;

        $result = $paymentService->getOrderStatus($gateway_order_id);

        if ($result['status'] === 'error') {
            $notifyCardPaymentFailureAction->handle($installment, $result['message'] ?? '');
            return redirect()->route('non-resident-insurance', ['step' => 3, 'errors' => ['message' => $result['message']]]);
        }

        $installment->update([
            'order_number' => $gateway_order_id
        ]);

        $cardPayment = $createCardPaymentAction->handle([
            'user_id' => $offer->user_id,
            'reference_number' => $gateway_order_id,
            'amount' => $installment->amount_due * 100,
            'axiom_currency_id' => $offer->axiom_currency_id,
            'payment_status_id' => PaymentStatus::STATUSES['VERIFIED'],
        ]);

        $installment->payment()->associate($cardPayment);
        $installment->save();

        $axiom_offer = $offer;
        $axiom_offer_id = $axiom_offer->axiom_id;

        try {
            $policy = NonResidentInsuranceGateway::createPolicy($axiom_offer_id);
        } catch (ApiLogicalException|ApiValidationException $e) {
            $installment->policy->fill([
                'policy_status_id' => PolicyStatus::STATUSES['MANUAL_REVIEW'],
                'user_id' => $axiom_offer->user_id,
            ]);
            $installment->policy->save();

            PolicyManualReviewRequiredEvent::dispatch($installment->policy);

            // fake success scenario for non-resident flow
            return Inertia::render('non-resident-insurance/non-resident-insurance', [
                'non_resident_insurance' => [
                    'status' => 'success',
                    'policy' => [
                        'policy_number' => '-',
                        'start_date' => $installment->policy->start_date,
                        'end_date' => $installment->policy->end_date,
                        'total_amount' => $installment->policy->total_amount,
                        'status' => $installment->policy->policy_status_id,
                        'installments' => array_map(fn($installment) => [
                            'number' => $installment['sequence'],
                            'total_amount' => $installment['amount_due'],
                        ], $installment->policy->installments->toArray()),
                    ],
                    'debit_note_url' => URL::temporarySignedRoute(
                        'installments.download',
                        now()->addMinutes(30),
                        ['installment' => $installment->id]
                    ),
                    'currency' => AxiomCurrency::where('id', $axiom_offer->axiom_currency_id)->firstOrFail()->axiom_id,
                    'step' => 4,
                ],
            ]);
        }

        $policyDTO = NonResidentInsurancePolicyDTO::from($policy);
        $firstInsured = $policyDTO->customer_groups->first()->insuredCustomers->first();

        $policyModel = $createNonResidentInsurancePolicyAction->handle([
            'user_id' => $axiom_offer->user_id,
            'axiom_id' => $policyDTO->id,
            'axiom_offer_id' => $axiom_offer->id,
            'policy_number' => $policyDTO->policy_number,
            'api_response_json' => json_encode($policy),
            'insured_first_name' => $firstInsured->firstName,
            'insured_last_name' => $firstInsured->lastName,
            'insured_pin' => $firstInsured->pin,
            'insured_count' => $policyDTO->customer_groups->first()->insuredCustomers->count(),
            'total_amount' => $policyDTO->total_amount,
            'axiom_currency_id' => AxiomCurrency::where('axiom_id', $policyDTO->currency)->firstOrFail()->id,
            'start_date' => $policyDTO->start_date,
            'end_date' => $policyDTO->end_date,
            'axiom_policy_status_id' => AxiomPolicyStatus::where('id', $policyDTO->policy_status_id)->firstOrFail()->id,
        ]);

        $installment->policy->insurable()->associate($policyModel);
        $installment->policy->fill([
            'user_id' => $axiom_offer->user_id,
            'policy_number' => $policyDTO->policy_number,
            'start_date' => $policyDTO->start_date,
            'end_date' => $policyDTO->end_date,
            'title' => $policyModel->title,
            'axiom_policy_status_id' => $policyModel->axiom_policy_status_id,
            'policy_status_id' => PolicyStatus::STATUSES['ACTIVE'],
        ]);
        $installment->policy->save();

        PolicyIssuedEvent::dispatch($installment->policy);

        GenerateInstallmentDebitNoteJob::dispatch($installment->id);

        $notifyCardPaymentSuccessAction->handle($cardPayment);

        $policyDTO->id = $policyModel->id;

        return Inertia::render('non-resident-insurance/non-resident-insurance', [
            'non_resident_insurance' => [
                'status' => 'success',
                'policy' => $policyDTO,
                'policy_url' => URL::temporarySignedRoute(
                    'non-resident-insurance.download-policy',
                    now()->addMinutes(30),
                    ['policy' => $policyModel->id]
                ),
                'debit_note_url' => URL::temporarySignedRoute(
                    'installments.download',
                    now()->addMinutes(30),
                    ['installment' => $installment->id]
                ),
                'currency' => AxiomCurrency::where('axiom_id', $policyDTO->currency)->firstOrFail()->axiom_id,
                'step' => 4,
            ],
        ]);
    }
}
