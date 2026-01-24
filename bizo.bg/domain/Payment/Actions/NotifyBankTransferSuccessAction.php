<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Mail\BankTransferSuccessMail;
use Domain\Payment\Models\BankTransfer;
use Illuminate\Support\Facades\Mail;

class NotifyBankTransferSuccessAction
{
    public function handle(BankTransfer $bankTransfer): void
    {
        $user = $bankTransfer->user;

        if (!$user || !$user->email) {
            return;
        }

        Mail::to($user->email)->send(new BankTransferSuccessMail($bankTransfer));
    }
}


