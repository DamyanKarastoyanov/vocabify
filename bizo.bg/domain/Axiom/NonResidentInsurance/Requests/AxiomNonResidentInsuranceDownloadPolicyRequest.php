<?php

namespace Domain\Axiom\NonResidentInsurance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AxiomNonResidentInsuranceDownloadPolicyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $policy = $this->route('policy');
        $mainPolicy = $policy->policy;

        $user = Auth::user();

        if (request()->hasValidSignature()) {
            return true; // Guest via signed URL
        }


        if(!$user) {
            return false;
        }

        if(!$mainPolicy?->isDownloadable()) {
            return false;
        }

        return $user->can('view', $mainPolicy);
    }
}
