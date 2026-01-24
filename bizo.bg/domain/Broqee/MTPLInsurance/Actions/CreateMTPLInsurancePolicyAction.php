<?php

namespace Domain\Broqee\MTPLInsurance\Actions;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsurancePolicy;

class CreateMTPLInsurancePolicyAction
{
    public function __construct(
        protected CreateMTPLInsurancePolicyMediaAction $createMTPLInsurancePolicyMediaAction
    ) {
        //
    }

    public function handle(array $policyData): BroqeeMTPLInsurancePolicy
    {
        $policy = new BroqeeMTPLInsurancePolicy();

        $policy->fill($policyData);
        $policy->save();

        $this->createMTPLInsurancePolicyMediaAction->handle($policy, $policyData['download_url']);

        return $policy;
    }
}
