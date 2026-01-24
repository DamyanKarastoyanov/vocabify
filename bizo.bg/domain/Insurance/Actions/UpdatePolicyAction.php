<?php

namespace Domain\Insurance\Actions;

use Domain\Insurance\Models\Policy;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Insurance\Events\PolicyCancellationEvent;
use Domain\Insurance\Events\PolicyIssuedEvent;
use Domain\Insurance\Events\PolicyManualReviewRequiredEvent;

class UpdatePolicyAction
{
    public function __construct(
    ) {
        //
    }

    public function handle(Policy $policy, array $policyData): Policy
    {
        $policy->fill($policyData);
        $policy->save();

        if ($policy->wasChanged('policy_status_id')) {
            switch ($policy->policy_status_id) {
                case PolicyStatus::STATUSES['ACTIVE']:
                    PolicyIssuedEvent::dispatch($policy);
                    break;
                case PolicyStatus::STATUSES['MANUAL_REVIEW']:
                    PolicyManualReviewRequiredEvent::dispatch($policy);
                    break;
                case PolicyStatus::STATUSES['CANCELLED']:
                    PolicyCancellationEvent::dispatch($policy);
                    break;
            }
        }

        return $policy;
    }
}
