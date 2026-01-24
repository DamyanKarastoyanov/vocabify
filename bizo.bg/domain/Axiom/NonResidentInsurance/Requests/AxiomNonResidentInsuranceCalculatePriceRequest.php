<?php

namespace Domain\Axiom\NonResidentInsurance\Requests;

use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePeriod;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AxiomNonResidentInsuranceCalculatePriceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // erm, we do not have a role-permission model yet
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'currencyCode' => 'required|exists:axiom_currencies,axiom_id',
            'insuranceTypeId' => 'required|exists:axiom_insurance_types,axiom_id',
            'numberOfInstallments' => 'required|exists:axiom_installment_types,axiom_id',
            'beginDate' => 'required',
            'period' => 'required|integer',
            // 'productDiscounts' => 'array',
            // 'productDiscounts.*.id' => 'required|exists:axiom_travel_insurance_discounts,axiom_id',
            // 'productDiscounts.*.discount' => 'required|numeric|min:0|max:100',
            'customerGroups' => 'required|array',
            'customerGroups.*.customerGroupId' => 'required|exists:axiom_non_resident_insurance_customer_groups,axiom_id',
            'customerGroups.*.count' => 'required|integer|min:1',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'insuranceTypeId' => AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID,
            'currencyCode' => AxiomCurrency::find($this->input('currency'))->axiom_id,
            'numberOfInstallments' => AxiomInstallmentType::find($this->input('installment'))->axiom_id,
            'beginDate' => Carbon::parse($this->input('start_date'))->toIso8601ZuluString(),
            'period' => AxiomNonResidentInsurancePeriod::find($this->input('period'))->axiom_id,
            // 'productDiscounts' => collect($this->input('discounts'))->map(function ($discount) {
            //     return [
            //         'discount_id' => $discount['id'],
            //         'discount' => $discount['discount'],
            //     ];
            // })->toArray(),
            'customerGroups' => collect($this->input('customer_groups'))->map(function ($group) {
                return [
                    'customerGroupId' => $group['id'],
                    'count' => $group['count'],
                ];
            })->toArray(),
        ]);
    }
}
