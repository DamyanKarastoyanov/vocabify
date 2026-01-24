<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePolicy;
use Domain\Axiom\HomeInsurance\Requests\AxiomHomeInsuranceDownloadPolicyRequest;
use Illuminate\Support\Facades\Storage;

class HomeInsuranceDownloadPolicyController
{
    public function __invoke(AxiomHomeInsuranceDownloadPolicyRequest $request, AxiomHomeInsurancePolicy $policy)
    {
        $media = $policy->getFirstMedia(AxiomHomeInsurancePolicy::MEDIA_COLLECTION);

        return Storage::disk($media->disk)
            ->download($media->getPathRelativeToRoot(), $media->file_name);
    }
}


