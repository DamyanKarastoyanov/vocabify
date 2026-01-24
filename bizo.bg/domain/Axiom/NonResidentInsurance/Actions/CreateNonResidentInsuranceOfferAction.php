<?php

namespace Domain\Axiom\NonResidentInsurance\Actions;

use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceOffer;
use Domain\Users\Services\UserResolverService;

class CreateNonResidentInsuranceOfferAction
{
    public function __construct(
        protected UserResolverService $userResolverService
    ) {
        //
    }

    public function handle(array $offerData): AxiomNonResidentInsuranceOffer
    {
        $offer = new AxiomNonResidentInsuranceOffer;

        if(!isset($offerData['user_id']) && isset($offerData['email'])) {
            $user = $this->userResolverService->resolveUser($offerData['email'], $offerData['user_data'] ?? []);
            $offerData['user_id'] = $user->id;
        }

        $offer->fill($offerData);
        $offer->save();

        return $offer;
    }
}
