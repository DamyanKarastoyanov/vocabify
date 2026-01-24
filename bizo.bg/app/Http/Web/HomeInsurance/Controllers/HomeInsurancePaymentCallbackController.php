<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use App\Exceptions\ApiLogicalException;
use App\Exceptions\ApiValidationException;
use App\Facades\HomeInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\HomeInsurance\Actions\CreateHomeInsurancePolicyAction;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsurancePolicyDTO;
use Domain\Axiom\HomeInsurance\Requests\AxiomHomeInsurancePaymentCallbackRequest;
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

class HomeInsurancePaymentCallbackController
{
    public function __invoke(
        AxiomHomeInsurancePaymentCallbackRequest $request,
        PaymentService $paymentService,
        CreateHomeInsurancePolicyAction $createHomeInsurancePolicyAction,
        CreateCardPaymentAction $createCardPaymentAction,
        NotifyCardPaymentSuccessAction $notifyCardPaymentSuccessAction,
        NotifyCardPaymentFailureAction $notifyCardPaymentFailureAction
    ): Response|RedirectResponse
    {
        $gateway_order_id = $request->query('orderId');

        $installment = Installment::where('order_number', $gateway_order_id)->first();
        if (!$installment) {
            return redirect()->route('home-insurance', ['step' => 4, 'errors' => ['message' => 'Поръчката не е намерена.']]);
        }

        $offer = $installment->policy->insurable;

        $result = $paymentService->getOrderStatus($gateway_order_id);

        if ($result['status'] === 'error') {
            $notifyCardPaymentFailureAction->handle($installment, $result['message'] ?? '');
            return redirect()->route('home-insurance', ['step' => 4, 'errors' => ['message' => $result['message']]]);
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
            $policy = HomeInsuranceGateway::createPolicy($axiom_offer_id);
        } catch (ApiValidationException|ApiLogicalException $e) {
            $installment->policy->fill([
                'policy_status_id' => PolicyStatus::STATUSES['MANUAL_REVIEW'],
                'user_id' => $axiom_offer->user_id,
            ]);
            $installment->policy->save();
            PolicyManualReviewRequiredEvent::dispatch($installment->policy);
           // fake success scenario
            return Inertia::render('home-insurance/home-insurance', [
                'home_insurance' => [
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
                    'step' => 5,
                ],
            ]);
        }

        $policyDTO = HomeInsurancePolicyDTO::from($policy);

        $policyModel = $createHomeInsurancePolicyAction->handle([
            'user_id' => $axiom_offer->user_id,
            'axiom_id' => $policyDTO->id,
            'axiom_offer_id' => $axiom_offer->id,
            'policy_number' => $policyDTO->policy_number,
            'api_response_json' => json_encode($policy),
            'axiom_district_id' => AxiomDistrict::where('axiom_id', $policyDTO->property->district_id)->first()->id ?? null,
            'axiom_municipality_id' => AxiomMunicipality::where('axiom_id', $policyDTO->property->municipality_id)->first()->id ?? null,
            'axiom_town_id' => AxiomTown::where('axiom_id', $policyDTO->property->town_id)->first()->id ?? null,
            'property_town_type' => $policyDTO->property->town_type,
            'property_address' => $policyDTO->property->address,
            'property_postal_code' => $policyDTO->property->post_code,
            'total_amount' => $policyDTO->total_amount,
            'axiom_currency_id' => AxiomCurrency::where('axiom_id', $policyDTO->currency)->firstOrFail()->id,
            'start_date' => $policyDTO->start_date,
            'end_date' => $policyDTO->end_date,
            'axiom_policy_status_id' => $policyDTO->status->id,
        ]);

        $installment->policy->insurable()->associate($policyModel);
        $installment->policy->fill([
            'user_id' => $axiom_offer->user_id,
            'policy_number' => $policyDTO->policy_number,
            'start_date' => $policyDTO->start_date,
            'end_date' => $policyDTO->end_date,
            'title' => $policyModel->title,
            'axiom_policy_status_id' => $policyDTO->status->id,
            'policy_status_id' => PolicyStatus::STATUSES['ACTIVE'],
        ]);
        $installment->policy->save();

        PolicyIssuedEvent::dispatch($installment->policy);

        GenerateInstallmentDebitNoteJob::dispatch($installment->id);

        $notifyCardPaymentSuccessAction->handle($cardPayment);

        $policyDTO->id = $policyModel->id;

        return Inertia::render('home-insurance/home-insurance', [
            'home_insurance' => [
                'status' => 'success',
                'policy' => $policyDTO,
                'policy_url' => URL::temporarySignedRoute(
                    'home-insurance.download-policy',
                    now()->addMinutes(30),
                    ['policy' => $policyModel->id]
                ),
                'debit_note_url' => URL::temporarySignedRoute(
                    'installments.download',
                    now()->addMinutes(30),
                    ['installment' => $installment->id]
                ),
                'currency' => AxiomCurrency::where('axiom_id', $policyDTO->currency)->firstOrFail()->axiom_id,
                'step' => 5,
            ],
        ]);
    }
}
