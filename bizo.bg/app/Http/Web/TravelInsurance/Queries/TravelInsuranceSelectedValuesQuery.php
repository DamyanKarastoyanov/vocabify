<?php

namespace App\Http\Web\TravelInsurance\Queries;

use Carbon\Carbon;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceDestination;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceCustomerGroup;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverageAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverage;
use Illuminate\Http\Request;

class TravelInsuranceSelectedValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    public function get(): array
    {
        $defaultCurrency = AxiomInsuranceType::query()
            ->where('axiom_id', AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID)
            ->with(['currencies'])
            ->first()
            ->currencies()
            ->first();

        $defaultDestination = AxiomTravelInsuranceDestination::query()
            ->first();

        $defaultTravelType = AxiomTravelInsuranceTravelType::query()
            ->first();

        $defaultInsuranceAmount = AxiomTravelInsuranceAmount::query()
            ->where('name', '30000')
            ->first();

        $defaultCustomerGroup = AxiomTravelInsuranceCustomerGroup::query()
            ->first();

        $defaultNumberOfPeople = 1;

        $defaultCustomerPersonalIdentificationNumberType = AxiomPersonalIdentificationNumberType::query()
            ->where('name', 'ЕГН')
            ->first();

        $defaultDistrict = AxiomDistrict::query()
            ->where('name', 'СОФИЯ-ГРАД')
            ->first();

        $baseData = [
            'start_date' => Carbon::now()->addDay()->format('Y-m-d H:i:s'),
            'end_date' => Carbon::now()->addDays(3)->format('Y-m-d H:i:s'),
            'birth_date' => Carbon::now()->subYears(18)->format('Y-m-d H:i:s'),
            'currency' => [
                'label' => $defaultCurrency->name,
                'value' => $defaultCurrency->id,
            ],
            'destination' => [
                'label' => $defaultDestination->name,
                'value' => $defaultDestination->id,
            ],
            'travel_type' => [
                'label' => $defaultTravelType->name,
                'value' => $defaultTravelType->id,
            ],
            'insurance_amount' => [
                'label' => $defaultInsuranceAmount->name,
                'value' => $defaultInsuranceAmount->id,
            ],
            'customer_group' => [
                'label' => $defaultCustomerGroup->name,
                'value' => $defaultCustomerGroup->id,
            ],
            'number_of_passengers' => $defaultNumberOfPeople,
            'number_of_passengers_under_18' => 0,
            'number_of_passengers_under_26' => 0,
            'additional_risks' => [],
            'customer_personal_identification_number_type' => [
                'label' => $defaultCustomerPersonalIdentificationNumberType->name,
                'value' => $defaultCustomerPersonalIdentificationNumberType->id,
            ],
            'customer_district' => [
                'label' => $defaultDistrict->name,
                'value' => $defaultDistrict->id,
            ],
            'payment_method' => [
                'label' => 'Плащане с карта',
                'value' => 'card',
            ],
        ];

        $additionalCoverages = AxiomTravelInsuranceAdditionalCoverage::all();

        foreach ($additionalCoverages as $coverage) {
            $baseData["additional_risk_{$coverage->axiom_id}_amount"] = $this->getAdditionalRisksDefaultValues($coverage->axiom_id);
        }

        return $baseData;
    }

    protected function getAdditionalRisksDefaultValues(int $additionalRiskId): array
    {
        $additionalRiskAmount = AxiomTravelInsuranceAdditionalCoverageAmount::query()
            ->whereHas('axiomTravelInsuranceAdditionalCoverages', function ($query) use ($additionalRiskId) {
                $query->where('axiom_travel_insurance_additional_coverages.id', $additionalRiskId);
            })
            ->select('id', 'name')
            ->first();

        if (!$additionalRiskAmount) {
            return [];
        }

        return [
            'value' => $additionalRiskAmount->id,
            'label' => $additionalRiskAmount->name,
        ];
    }
}
