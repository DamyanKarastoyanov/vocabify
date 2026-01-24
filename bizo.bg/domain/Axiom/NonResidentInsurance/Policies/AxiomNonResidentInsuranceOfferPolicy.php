<?php

namespace Domain\Axiom\NonResidentInsurance\Policies;

use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceOffer;
use Domain\Users\Models\User;

class AxiomNonResidentInsuranceOfferPolicy
{
    public function view(User $user, AxiomNonResidentInsuranceOffer $offer): bool
    {
        return $offer->user_id === $user->id;
    }
}
