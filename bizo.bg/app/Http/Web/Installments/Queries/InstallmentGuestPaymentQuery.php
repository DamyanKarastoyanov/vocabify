<?php

namespace App\Http\Web\Installments\Queries;

use Domain\Payment\Models\InstallmentGuestPayment;
use Domain\Payment\Requests\InstallmentGuestPaymentRequest;

class InstallmentGuestPaymentQuery
{
    /**
     * Constructor.
     */
    protected InstallmentGuestPayment $guestPayment;

    public function __construct(
        protected InstallmentGuestPaymentRequest $request,
    ) {
        $guestPayment = $request->input('guest_payment');
        
        $this->guestPayment = $guestPayment;
        $this->guestPayment->markAccessed();
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $step = $this->request->input('step', 1);
        $installment = $this->guestPayment->installment;
        $validFieldValues = (new InstallmentGuestPaymentValidFieldValuesQuery(
            $this->request,
        ))->get();

        return [
            'step' => $step,
            'token' => $this->guestPayment->token,
            'valid_field_values' => $validFieldValues,
            'installment' => [
                'id' => $installment->id,
                'amount_due' => $installment->amount_due,
                'currency' => $installment->currency?->axiom_id,
                'due_date' => $installment->due_date,
                'policy_number' => $installment->policy->policy_number,
                'policy_status' => $installment->policy->policy_status_id,
                'insurance_type_name' => $installment->policy->insuranceType->name,
            ],
        ];
    }
}
