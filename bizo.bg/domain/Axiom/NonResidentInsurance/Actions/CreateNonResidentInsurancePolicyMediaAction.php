<?php

namespace Domain\Axiom\NonResidentInsurance\Actions;

use App\Facades\NonResidentInsuranceGateway;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePolicy;

class CreateNonResidentInsurancePolicyMediaAction
{
    public function handle(AxiomNonResidentInsurancePolicy $policy): void
    {
        $fileData = NonResidentInsuranceGateway::getPolicyPDF($policy->axiom_id);

        $file = $fileData['fileData'];
        $originalFileName = $fileData['originalFileName'];

        if (!str_starts_with($file, 'data:')) {
            $file = 'data:application/pdf;base64,' . $file;
        }

        $policy
            ->addMediaFromBase64($file)
            ->usingFileName($originalFileName)
            ->toMediaCollection(AxiomNonResidentInsurancePolicy::MEDIA_COLLECTION);
    }
}
