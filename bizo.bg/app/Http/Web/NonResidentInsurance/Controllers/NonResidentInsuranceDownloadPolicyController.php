<?php

namespace App\Http\Web\NonResidentInsurance\Controllers;

use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePolicy;
use Domain\Axiom\NonResidentInsurance\Requests\AxiomNonResidentInsuranceDownloadPolicyRequest;
use Illuminate\Support\Facades\Storage;

class NonResidentInsuranceDownloadPolicyController
{
    public function __invoke(AxiomNonResidentInsuranceDownloadPolicyRequest $request, AxiomNonResidentInsurancePolicy $policy)
    {
        $media = $policy->getFirstMedia(AxiomNonResidentInsurancePolicy::MEDIA_COLLECTION);

        return Storage::disk($media->disk)
            ->download($media->getPathRelativeToRoot(), $media->file_name);
    }
}


