<?php

namespace Domain\Axiom\HomeInsurance\Actions;

use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsuranceOffer;
use Domain\Users\Services\UserResolverService;

class CreateHomeInsuranceOfferAction
{
    public function __construct(
        protected UserResolverService $userResolverService
    ) {
        //
    }

    public function handle(array $offerData): AxiomHomeInsuranceOffer
    {
        $offer = new AxiomHomeInsuranceOffer;

        if(!isset($offerData['user_id']) && isset($offerData['email'])) {
            $user = $this->userResolverService->resolveUser($offerData['email'], $offerData['user_data'] ?? []);
            $offerData['user_id'] = $user->id;
        }

        $offer->fill($offerData);
        $offer->save();

        return $offer;
    }
}
