<?php

namespace Domain\Axiom\TravelInsurance\Policies;

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceOffer;
use Domain\Users\Models\User;

class AxiomTravelInsuranceOfferPolicy
{
    public function view(User $user, AxiomTravelInsuranceOffer $offer): bool
    {
        return $offer->user_id === $user->id;
    }
}
