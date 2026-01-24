<?php

namespace Domain\Axiom\TravelInsurance\Actions;

use App\Facades\TravelInsuranceGateway;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsurancePolicy;

class CreateTravelInsurancePolicyMediaAction
{
    public function handle(AxiomTravelInsurancePolicy $policy): void
    {
        $fileData = TravelInsuranceGateway::getPolicyPDF($policy->axiom_id);

        $file = $fileData['fileData'];
        $originalFileName = $fileData['originalFileName'];

        if (!str_starts_with($file, 'data:')) {
            $file = 'data:application/pdf;base64,' . $file;
        }

        $policy
            ->addMediaFromBase64($file)
            ->usingFileName($originalFileName)
            ->toMediaCollection(AxiomTravelInsurancePolicy::MEDIA_COLLECTION);
    }
}
