<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Models\Installment;

class CreateInstallmentAction
{
    public function handle(array $installmentData): Installment
    {
        $installment = new Installment();

        $installment->fill($installmentData);
        $installment->save();

        return $installment;
    }
}
