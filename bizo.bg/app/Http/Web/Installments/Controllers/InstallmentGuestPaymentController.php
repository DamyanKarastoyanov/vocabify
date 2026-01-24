<?php

namespace App\Http\Web\Installments\Controllers;

use App\Http\Web\Installments\Queries\InstallmentGuestPaymentQuery;
use Domain\Payment\Requests\InstallmentGuestPaymentRequest;
use Inertia\Response;

class InstallmentGuestPaymentController
{
    public function __invoke(
        InstallmentGuestPaymentRequest $request
    ): Response {
        return inertia('installment-guest-payments/installment-guest-payments', [
            'installment_guest_payment' => fn() => (new InstallmentGuestPaymentQuery(
                $request,
            ))->get(),
            'errors' => $request->errors,
        ]);
    }
}
