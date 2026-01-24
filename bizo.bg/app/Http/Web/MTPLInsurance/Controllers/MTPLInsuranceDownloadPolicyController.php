<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsurancePolicy;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceDownloadPolicyRequest;
use Illuminate\Support\Facades\Storage;

class MTPLInsuranceDownloadPolicyController
{
    public function __invoke(BroqeeMTPLInsuranceDownloadPolicyRequest $request, BroqeeMTPLInsurancePolicy $policy)
    {
        $media = $policy->getFirstMedia(BroqeeMTPLInsurancePolicy::MEDIA_COLLECTION);

        return Storage::disk($media->disk)
            ->download($media->getPathRelativeToRoot(), $media->file_name);
    }
}


