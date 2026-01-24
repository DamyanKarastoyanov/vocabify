<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Models\BankTransfer;

class UpdateBankTransferAction
{
    public function handle(array $paymentData, BankTransfer $bankTransfer): BankTransfer
    {
        $bankTransfer->fill($paymentData);
        $bankTransfer->save();

        return $bankTransfer;
    }
}
