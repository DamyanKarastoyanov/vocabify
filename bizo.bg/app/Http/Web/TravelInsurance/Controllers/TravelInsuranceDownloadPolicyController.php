<?php

namespace App\Http\Web\TravelInsurance\Controllers;

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsurancePolicy;
use Domain\Axiom\TravelInsurance\Requests\AxiomTravelInsuranceDownloadPolicyRequest;
use Illuminate\Support\Facades\Storage;

class TravelInsuranceDownloadPolicyController
{
    public function __invoke(AxiomTravelInsuranceDownloadPolicyRequest $request, AxiomTravelInsurancePolicy $policy)
    {
        $media = $policy->getFirstMedia(AxiomTravelInsurancePolicy::MEDIA_COLLECTION);

        return Storage::disk($media->disk)
            ->download($media->getPathRelativeToRoot(), $media->file_name);
    }
}


