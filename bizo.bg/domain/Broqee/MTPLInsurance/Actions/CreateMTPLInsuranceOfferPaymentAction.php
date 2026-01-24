<?php

namespace Domain\Broqee\MTPLInsurance\Actions;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOfferPayment;

class CreateMTPLInsuranceOfferPaymentAction
{
    public function handle(array $paymentData): BroqeeMTPLInsuranceOfferPayment
    {
        $payment = BroqeeMTPLInsuranceOfferPayment::updateOrCreate(
            [
                'broqee_mtpl_insurance_offer_id' => $paymentData['broqee_mtpl_insurance_offer_id'] ?? null,
                'number' => $paymentData['number'] ?? null,
            ],
            $paymentData
        );

        return $payment;
    }
}


