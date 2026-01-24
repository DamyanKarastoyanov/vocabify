<?php

namespace App\Http\Web\Policies\Controllers;

use App\Http\Web\Installments\Queries\InstallmentsQuery;
use App\Http\Web\Installments\Resources\InstallmentsResource;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Requests\GetPolicyDetailsRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class PolicyInstallmentDetailsController
{
    public function __invoke(GetPolicyDetailsRequest $request, Policy $policy): JsonResource
    {
        return InstallmentsResource::make((new InstallmentsQuery($request, $policy->id))->get());
    }
}
