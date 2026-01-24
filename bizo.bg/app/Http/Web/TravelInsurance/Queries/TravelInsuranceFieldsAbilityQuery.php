<?php

namespace App\Http\Web\TravelInsurance\Queries;

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverageAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverage;
use Illuminate\Http\Request;

class TravelInsuranceFieldsAbilityQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    /**
     * Get the field ability states.
     * Returns an array where keys are field names and values are boolean indicating if the field is enabled.
     */
    public function get(): array
    {
        $abilities = [];
        
        $additionalCoverages = AxiomTravelInsuranceAdditionalCoverage::all();
        
        foreach ($additionalCoverages as $coverage) {
            $abilities["additional_risk_{$coverage->axiom_id}_amount"] = $this->getAdditionalRisksAbility($coverage->axiom_id);
        }
        
        $abilities['currency'] = false;
        $abilities['customer_group'] = false;
        
        return $abilities;
    }

    protected function getAdditionalRisksAbility(int $additionalRiskId): bool
    {
        $additionalRiskAmountsCount = AxiomTravelInsuranceAdditionalCoverageAmount::query()
        ->whereHas('axiomTravelInsuranceAdditionalCoverages', function ($query) use ($additionalRiskId) {
            $query->where('axiom_travel_insurance_additional_coverages.id', $additionalRiskId);
        })
        ->select('id', 'name')
        ->count();

        if ($additionalRiskAmountsCount > 1) {
            return true;
        }

        return false;
    }
}
