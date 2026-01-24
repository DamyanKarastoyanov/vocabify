<?php

namespace App\Http\Web\Policies\Controllers;

use App\Http\Web\Policies\Queries\PolicyDetailsQuery;
use App\Http\Web\Policies\Resources\PolicyDetailsResource;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Requests\GetPolicyDetailsRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class PoliciesPolicyDetailsController
{
    public function __invoke(GetPolicyDetailsRequest $request, Policy $policy): JsonResource
    {
        return PolicyDetailsResource::make((new PolicyDetailsQuery($request, $policy))->get());
    }
}
