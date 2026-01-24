<?php

namespace Domain\Broqee\MTPLInsurance\Actions;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CreateMTPLInsuranceOfferAction
{
    public function __construct(
        protected CreateMTPLInsuranceOfferPaymentAction $createMTPLInsuranceOfferPaymentAction
    ) {
        //
    }

    public function handle(array $offerData): BroqeeMTPLInsuranceOffer
    {
        // Ensure required fields exist or have safe defaults
        $offerData['order_number'] = $offerData['order_number'] ?? Str::uuid()->toString();
        $offerData['api_response_json'] = $offerData['api_response_json'] ?? json_encode($offerData);
        $offerData['api_request_dto_json'] = $offerData['api_request_dto_json'] ?? json_encode([]);

        $offer = BroqeeMTPLInsuranceOffer::updateOrCreate(
            [
                'broqee_offer_id' => $offerData['offer'] ?? null,
            ],
            [
                'broqee_offer_id' => $offerData['offer'] ?? null,
                'user_id' => $offerData['user_id'] ?? null,
                'order_number' => $offerData['order_number'],
                'api_response_json' => $offerData['api_response_json'],
                'api_request_dto_json' => $offerData['api_request_dto_json'],
                'status' => $offerData['status'] ?? null,
                'total' => $offerData['total'] ?? null,
                'total_bgn' => $offerData['total_bgn'] ?? null,
                'total_eur' => $offerData['total_eur'] ?? null,
            ]
        );

        // Payments can be a Collection or array; iterate and create/update each
        $payments = $offerData['payments'] ?? [];
        if ($payments instanceof Collection) {
            $payments = $payments->all();
        }

        foreach ($payments as $payment) {
            $this->createMTPLInsuranceOfferPaymentAction->handle([
                'broqee_mtpl_insurance_offer_id' => $offer->id,
                'number' => is_array($payment) ? ($payment['number'] ?? null) : ($payment->number ?? null),
                'total' => is_array($payment) ? ($payment['total'] ?? null) : ($payment->total ?? null),
                'total_bgn' => is_array($payment) ? ($payment['total_bgn'] ?? null) : ($payment->total_bgn ?? null),
                'total_eur' => is_array($payment) ? ($payment['total_eur'] ?? null) : ($payment->total_eur ?? null),
            ]);
        }

        return $offer;
    }
}


