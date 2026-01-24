<?php

namespace App\Http\Web\Admin\Policies\Controllers;

use Domain\Insurance\Actions\UpdatePolicyAction;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Requests\UpdatePolicyStatusRequest;

class PoliciesUpdatePolicyStatusController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected UpdatePolicyAction $updatePolicyAction
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdatePolicyStatusRequest $request, Policy $policy): array
    {
        $policyData = $request->validated();
        $updatedPolicy = $this->updatePolicyAction->handle($policy, $policyData);

        return [
            'success' => isset($updatedPolicy->id),
            'policy' => $updatedPolicy,
        ];
    }
}

/*

    fetch("http://local.bizo.bg/admin/policies/6/update", {
    headers: {
        "accept": "application/json",
        "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    referrer: "http://local.bizo.bg/home-insurance",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
        policy_status_id: 2,
        axiom_policy_status_id: 1
    }),
    method: "POST",
    mode: "cors",
    credentials: "include"
    });


*/
