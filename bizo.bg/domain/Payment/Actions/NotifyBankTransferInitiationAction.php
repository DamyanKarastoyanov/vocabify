<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Mail\BankTransferInitiationMail;
use Domain\Payment\Models\Installment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class NotifyBankTransferInitiationAction
{
    public function handle(Installment $installment): void
    {
        $user = $installment->user;

        Mail::to($user->email)->send(new BankTransferInitiationMail($installment));
    }
}


