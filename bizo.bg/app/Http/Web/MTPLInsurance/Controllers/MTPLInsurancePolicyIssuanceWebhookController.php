<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Broqee\MTPLInsurance\Actions\CreateMTPLInsurancePolicyAction;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Domain\Insurance\Events\PolicyIssuedEvent;
use Domain\Insurance\Events\PolicyManualReviewRequiredEvent;
use Domain\Insurance\Models\PolicyStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

/*
    Outta BroQee dox:

    {
        "order_id": 1203,
        "order_items_id": 17,
        "broqee_order_id": 5544,
        "policy": {
        "number": "BG/23/133002783333",
        "insurer_keyword": "ozk",
        "issued_at": "16.07.2025",
        "..."
        },
        "prints": {
        "policy": "https://........pdf",
        "note": "https://........pdf",
        "..."
        },
        "date": "2025-07-16T12:16:11.601097Z"
    }

    And for failure:

    {
        "success": false,
        "errors": {
        "issue": "Застрахователят не позволи издаване на тази полица"
        },
        "data": {
        "order_id": 1203,
        "order_items_id": 17,
        "..."
        }
    }
*/

class MTPLInsurancePolicyIssuanceWebhookController
{
    public function __invoke(
        Request $request,
        CreateMTPLInsurancePolicyAction $createMTPLInsurancePolicyAction,
    ): JsonResource|JsonResponse
    {
        try {
            $response = $request->all();

            Log::info('MTPLInsurancePolicyIssuanceWebhookController', ['request' => $request->all()]);

            $broquee_order_id = $response['broqee_order_id'] ?? null;
            $offer = BroqeeMTPLInsuranceOffer::firstWhere('broqee_order_number', $broquee_order_id);

            if(isset($response['success']) && $response['success'] === false) {
                Log::error('MTPLInsurancePolicyIssuanceWebhookController: issue failure', ['response' => $response]);

                $offer->update([
                    'status' => BroqeeMTPLInsuranceOffer::STATUSES['DECLINED'],
                ]);

                $offer->policy->fill([
                    'policy_status_id' => PolicyStatus::STATUSES['MANUAL_REVIEW'],
                ]);
                $offer->policy->save();

                PolicyManualReviewRequiredEvent::dispatch($offer->policy);
            } else {
                $policyModel = $createMTPLInsurancePolicyAction->handle([
                    'user_id' => $offer->user_id,
                    'total_amount' => $offer->total,
                    'axiom_currency_id' => AxiomCurrency::firstWhere('axiom_id', 'BGN')->id,
                    'policy_number' => $response['policy']['number'] ?? '',
                    'insurer_keyword' => $response['policy']['insurer_keyword'] ?? '',
                    'broqee_mtpl_insurance_offer_id' => $offer->id,
                    'api_response_json' => json_encode($response),
                    'start_date' => $response['policy']['start_date'] ?? null,
                    'end_date' => $response['policy']['end_date'] ?? null,
                    'axiom_policy_status_id' => AxiomPolicyStatus::ACTIVE_ID,
                    'download_url' => $response['prints']['policy'] ?? null,
                ]);

                $policy = $offer->policy;
                $installment = $policy->installments()->first();

                $policy->insurable()->associate($policyModel);
                $policy->fill([
                    'user_id' => $policyModel->user_id,
                    'policy_number' => $policyModel->policy_number,
                    'start_date' => $policyModel->start_date,
                    'end_date' => $policyModel->end_date,
                    'title' => $policyModel->title,
                    'axiom_policy_status_id' => $policyModel->status->id,
                    'policy_status_id' => ($installment->payment && $installment->payment->isVerified()) ? PolicyStatus::STATUSES['ACTIVE'] : PolicyStatus::STATUSES['AWAITING_PAYMENT_CONFIRMATION'],
                ]);
                $policy->save();

                PolicyIssuedEvent::dispatchIf($policy->policy_status_id === PolicyStatus::STATUSES['ACTIVE'], $policy);
            }
        } catch(\Exception $e){
            return response()->json([
                'data' => "ok",
                'success' => true,
            ], 200);
        }

        return response()->json([
            'data' => "ok",
            'success' => true,
        ], 200);
    }
}

/*

    fetch("http://local.bizo.bg/mtpl-insurance/policy-issuance", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
            'Content-Type': 'application/json',
        },
        "referrer": "http://local.bizo.bg/home-insurance",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
                "success": false,
                "errors": {
                    "issue": "Застрахователят не позволи издаване на тази полица"
                },
                "data": {
                    "order_id": 'f30bcef9-e38a-4d35-b8b8-a6837937bf58',
                    "order_items_id": 'f30bcef9-e38a-4d35-b8b8-a6837937bf58',
                    "broqee_order_id": 5544,
                }
            }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    fetch("http://local.bizo.bg/mtpl-insurance/policy-issuance", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
            'Content-Type': 'application/json',
        },
        "referrer": "http://local.bizo.bg/home-insurance",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
            "policy": {
                "number": "BG/30/1253916582485",
                "insurer_keyword": "dallbogg",
                "issued_at": "04.12.2025",
                "start_date": "05.12.2025",
                "end_date": "04.12.2026",
                "total": "437.84",
                "premium": "412.49",
                "payments": {
                    "1": {
                        "number": 1,
                        "due_at": "05.12.2025",
                        "status_id": 1,
                        "paid_at": "04.12.2025",
                        "total": "437.84",
                        "premium": "412.49"
                    }
                }
            },
            "prints": {
                "policy": "https://os.broqee.net/2fa9a244cc56445ab986b5918a81e52b:broqee/twg/25/Полица-bg301253916582485-95cf0ac77b0d6515dea672bd649677a224e2d141.pdf",
                "note": "https://os.broqee.net/2fa9a244cc56445ab986b5918a81e52b:broqee/twg/26/Сметка-1-95cf0ac77b0d6515dea672bd649677a224e2d141.pdf"
            },
            "order_id": "6d478203-2f77-4e25-be22-c3f92919c544",
            "order_items_id": "6d478203-2f77-4e25-be22-c3f92919c544",
            "broqee_order_id": 15,
            "date": "202512041537"
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

*/


