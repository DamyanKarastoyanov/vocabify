<?php

namespace Domain\Axiom\HomeInsurance\Actions;

use App\Facades\HomeInsuranceGateway;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePolicy;

class CreateHomeInsurancePolicyMediaAction
{
    public function handle(AxiomHomeInsurancePolicy $policy): void
    {
        $fileData = HomeInsuranceGateway::getPolicyPDF($policy->axiom_id);

        $file = $fileData['fileData'];
        $originalFileName = $fileData['originalFileName'];

        if (!str_starts_with($file, 'data:')) {
            $file = 'data:application/pdf;base64,' . $file;
        }

        $policy
            ->addMediaFromBase64($file)
            ->usingFileName($originalFileName)
            ->toMediaCollection(AxiomHomeInsurancePolicy::MEDIA_COLLECTION);
    }
}
