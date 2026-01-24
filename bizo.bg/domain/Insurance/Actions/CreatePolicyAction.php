<?php

namespace Domain\Insurance\Actions;

use Domain\Insurance\Models\Policy;

class CreatePolicyAction
{
    public function handle(array $policyData): Policy
    {
        $policy = new Policy;

        $policy->fill($policyData);
        $policy->save();

        return $policy;
    }
}
