<?php

namespace App\Http\Web\HomeInsurance\Queries;

use Carbon\Carbon;
use Domain\Axiom\Global\Models\AxiomBank;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePeriod;
use Illuminate\Http\Request;

class HomeInsuranceSelectedValuesQuery
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

        $defaultPeriod = AxiomHomeInsurancePeriod::query()
            ->where('name', '1 година')
            ->first();

        $defaultCurrency = AxiomInsuranceType::query()
            ->where('axiom_id', AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID)
            ->with(['currencies' => function ($query) {
                $query->where('name', 'Български лев');
            }])
            ->first()
            ->currencies()
            ->first();

        $defaultInstallment = AxiomInstallmentType::query()
            ->where('name', 'Една вноска')
            ->first();

        $defaultCustomerPersonalIdentificationNumberType = AxiomPersonalIdentificationNumberType::query()
            ->where('name', 'ЕГН')
            ->first();

        $defaultBank = AxiomBank::query()
            ->where('axiom_id', 1)
            ->first();

        return [
            'district' => [
                'label' => $defaultDistrict->name,
                'value' => $defaultDistrict->id,
            ],
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
            'bank' => [
                'label' => $defaultBank->name,
                'value' => $defaultBank->id,
            ],
        ];
    }
}
