<?php

namespace Domain\Axiom\TravelInsurance\Actions;

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceOffer;
use Domain\Users\Services\UserResolverService;

class CreateTravelInsuranceOfferAction
{
    public function __construct(
        protected UserResolverService $userResolverService
    ) {
        //
    }

    public function handle(array $offerData): AxiomTravelInsuranceOffer
    {
        $offer = new AxiomTravelInsuranceOffer;

        if(!isset($offerData['user_id']) && isset($offerData['email'])) {
            $user = $this->userResolverService->resolveUser($offerData['email'], $offerData['user_data'] ?? []);
            $offerData['user_id'] = $user->id;
        }

        $offer->fill($offerData);
        $offer->save();

        return $offer;
    }
}
