<?php

namespace App\Http\Web\NonResidentInsurance\Queries;

use Carbon\Carbon;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceCustomerGroup;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePeriod;
use Illuminate\Http\Request;

class NonResidentInsuranceSelectedValuesQuery
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
        $defaultDistrict = AxiomDistrict::query()
            ->where('name', 'СОФИЯ-ГРАД')
            ->first();

        $defaultCurrency = AxiomInsuranceType::query()
            ->where('axiom_id', AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID)
            ->with(['currencies'])
            ->first()
            ->currencies()
            ->first();

        $defaultInstallment = AxiomInstallmentType::query()
            ->where('name', 'Една вноска')
            ->first();

        $defaultPersonalIdentificationNumberType = AxiomPersonalIdentificationNumberType::query()
            ->where('name', 'НДС')
            ->first();

        $defaultPeriod = AxiomNonResidentInsurancePeriod::query()
            ->where('name', '1 година')
            ->first();

        $defaultCustomerGroup = AxiomNonResidentInsuranceCustomerGroup::query()
            ->first();

        return [
            'start_date' => Carbon::now()->addDay()->format('Y-m-d H:i:s'),
            'period' => [
                'label' => $defaultPeriod->name,
                'value' => $defaultPeriod->id,
            ],
            'currency' => [
                'label' => $defaultCurrency->name,
                'value' => $defaultCurrency->id,
            ],
            'installment' => [
                'label' => $defaultInstallment->name,
                'value' => $defaultInstallment->id,
            ],
            'customer_group' => [
                'label' => $defaultCustomerGroup->name,
                'value' => $defaultCustomerGroup->id,
            ],
            'district' => [
                'label' => $defaultDistrict->name,
                'value' => $defaultDistrict->id,
            ],
            'personal_identification_number_type' => [
                'label' => $defaultPersonalIdentificationNumberType->name,
                'value' => $defaultPersonalIdentificationNumberType->id,
            ],
            'payment_method' => [
                'label' => 'Плащане с карта',
                'value' => 'card',
            ],
            'birth_date' => Carbon::now()->subYears(18)->format('Y-m-d H:i:s'),
        ];
    }
}
