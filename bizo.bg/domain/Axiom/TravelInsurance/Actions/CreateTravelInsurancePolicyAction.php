<?php

namespace Domain\Axiom\TravelInsurance\Actions;

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsurancePolicy;

class CreateTravelInsurancePolicyAction
{
    public function __construct(
        protected CreateTravelInsurancePolicyMediaAction $createTravelInsurancePolicyMediaAction
    ) {
        //
    }

    public function handle(array $policyData): AxiomTravelInsurancePolicy
    {
        $policy = new AxiomTravelInsurancePolicy;
        $policy->fill($policyData);
        $policy->save();

        $this->createTravelInsurancePolicyMediaAction->handle($policy);

        return $policy;
    }
}
