<?php

namespace Domain\Payment\Actions;

use Domain\Payment\Models\Installment;
use Domain\Payment\Models\InstallmentPaymentToken;
use Illuminate\Support\Str;

class GenerateInstallmentGuestPaymentAction
{
    public function handle(Installment $installment, int $expiresInDays = 30): InstallmentPaymentToken
    {
        return InstallmentPaymentToken::updateOrCreate(
            ['installment_id' => $installment->id],
            [
                'token' => Str::uuid()->toString(),
                'expires_at' => now()->addDays($expiresInDays),
                'accessed_at' => null,
            ]
        );
    }
}
