<?php

namespace Domain\Axiom\HomeInsurance\Policies;

use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsuranceOffer;
use Domain\Users\Models\User;

class AxiomHomeInsuranceOfferPolicy
{
    public function view(User $user, AxiomHomeInsuranceOffer $offer): bool
    {
        return $offer->user_id === $user->id;
    }
}
