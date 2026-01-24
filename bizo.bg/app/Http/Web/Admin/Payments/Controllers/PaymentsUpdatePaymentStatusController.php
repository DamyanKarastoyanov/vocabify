<?php

namespace App\Http\Web\Admin\Payments\Controllers;

use Domain\Payment\Actions\UpdateBankTransferAction;
use Domain\Payment\Actions\VerifyBankTransferAction;
use Domain\Payment\Models\BankTransfer;
use Domain\Payment\Models\PaymentStatus;
use Domain\Payment\Requests\UpdateBankTransferStatusRequest;
use Domain\Users\Actions\NotifyAccountActivationAction;

class PaymentsUpdatePaymentStatusController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected UpdateBankTransferAction $updateBankTransferAction,
        protected VerifyBankTransferAction $verifyBankTransferAction,
        protected NotifyAccountActivationAction $notifyAccountActivationAction
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(BankTransfer $bank_transfer, UpdateBankTransferStatusRequest $request): array
    {
        $bankTransferData = $request->validated();
        if($bankTransferData['payment_status_id'] == PaymentStatus::STATUSES['VERIFIED']){
           $bank_transfer = $this->verifyBankTransferAction->handle($bank_transfer);
           $this->notifyAccountActivationAction->handle($bank_transfer->user, true);
        } else {
            $bank_transfer = $this->updateBankTransferAction->handle($bankTransferData, $bank_transfer);
        }

        return [
            'success' => isset($bank_transfer->id),
            'bankTransfer' => $bank_transfer,
        ];
    }
}

/*

    fetch("http://local.bizo.bg/admin/payments/6/update", {
    headers: {
        "accept": "application/json",
        "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    referrer: "http://local.bizo.bg/home-insurance",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
        payment_status_id: 2
    }),
    method: "POST",
    mode: "cors",
    credentials: "include"
    });


*/
