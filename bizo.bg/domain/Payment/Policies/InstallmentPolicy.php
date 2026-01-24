<?php

namespace Domain\Payment\Policies;

use Domain\Payment\Models\Installment;
use Domain\Users\Models\User;

class InstallmentPolicy
{
    public function view(User $user, Installment $installment): bool
    {
        return $installment->policy?->user_id === $user->id ?? false;
    }
}
