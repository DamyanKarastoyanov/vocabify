<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Models\BankTransfer;

class CreateBankTransferAction
{
    public function handle(array $paymentData): BankTransfer
    {
        $bankTransfer = new BankTransfer();

        $bankTransfer->fill($paymentData);
        $bankTransfer->save();

        return $bankTransfer;
    }
}
