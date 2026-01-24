<?php

namespace Domain\Axiom\NonResidentInsurance\Actions;

use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePolicy;

class CreateNonResidentInsurancePolicyAction
{
    public function __construct(
        protected CreateNonResidentInsurancePolicyMediaAction $createNonResidentInsurancePolicyMediaAction
    ) {
        //
    }

    public function handle(array $policyData): AxiomNonResidentInsurancePolicy
    {
        $policy = new AxiomNonResidentInsurancePolicy();
        $policy->fill($policyData);
        $policy->save();

        $this->createNonResidentInsurancePolicyMediaAction->handle($policy);

        return $policy;
    }
}
