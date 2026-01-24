<?php

namespace Domain\Axiom\HomeInsurance\Actions;

use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePolicy;

class CreateHomeInsurancePolicyAction
{
    public function __construct(
        protected CreateHomeInsurancePolicyMediaAction $createHomeInsurancePolicyMediaAction
    ) {
        //
    }

    public function handle(array $policyData): AxiomHomeInsurancePolicy
    {
        $policy = new AxiomHomeInsurancePolicy;

        $policy->fill($policyData);
        $policy->save();

        $this->createHomeInsurancePolicyMediaAction->handle($policy);

        return $policy;
    }
}
