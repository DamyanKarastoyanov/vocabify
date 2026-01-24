<?php

namespace Domain\Axiom\TravelInsurance\Requests;

use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverageAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceCustomerGroup;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceDestination;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelTypeActivity;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AxiomTravelInsuranceCalculatePriceRequest extends FormRequest
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
            'endDate' => 'required|after_or_equal:beginDate',
            'travelTypeId' => 'required|exists:axiom_travel_insurance_travel_types,axiom_id',
            'travelTypeActivityId' => 'nullable|exists:axiom_travel_insurance_travel_type_activities,axiom_id',
            'territorialCoverageId' => 'required|exists:axiom_travel_insurance_destinations,axiom_id',
            'additionalCoverages' => 'sometimes|array',
            'additionalCoverages.*.additionalCoverageId' => 'required|exists:axiom_travel_insurance_additional_coverages,axiom_id',
            'additionalCoverages.*.name' => 'required|string|max:255',
            'additionalCoverages.*.selected' => 'required|boolean',
            'additionalCoverages.*.insuranceAmount' => 'required|exists:axiom_travel_insurance_additional_coverage_amounts,axiom_id',
            'productDiscounts' => 'array',
            'productDiscounts.*.id' => 'required|exists:axiom_travel_insurance_discounts,axiom_id',
            'productDiscounts.*.discount' => 'required|numeric|min:0|max:100',
            'isMultiTravel' => 'boolean',
            'maxDaysPerTravel' => 'integer|min:0',
            'customerGroups' => 'required|array',
            'customerGroups.*.travelCustomerGroupId' => 'required|exists:axiom_travel_insurance_customer_groups,axiom_id',
            'customerGroups.*.count' => 'required|integer|min:1',
            'customerGroups.*.countUnder14' => 'required|integer|min:0',
            'customerGroups.*.countUnder18' => 'required|integer|min:0',
            'customerGroups.*.countUnder26' => 'required|integer|min:0',
            'customerGroups.*.insuranceAmount' => 'required|numeric|min:0',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'insuranceTypeId' => AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID,
            'currencyCode' => AxiomCurrency::find($this->input('currency'))->axiom_id,
            'numberOfInstallments' => AxiomInstallmentType::find($this->input('installment'))->axiom_id,
            'beginDate' => Carbon::parse($this->input('start_date'))->toIso8601ZuluString(),
            'endDate' => Carbon::parse($this->input('end_date'))->toIso8601ZuluString(),
            'travelTypeId' => AxiomTravelInsuranceTravelType::find($this->input('travel_type'))->axiom_id,
            'travelTypeActivityId' => AxiomTravelInsuranceTravelTypeActivity::find($this->input('travel_type_activity'))?->axiom_id,
            'territorialCoverageId' => AxiomTravelInsuranceDestination::find($this->input('destination'))->axiom_id,
            'additionalCoverages' => collect($this->input('additional_coverages'))->map(function ($coverage) {
                return [
                    'additionalCoverageId' => $coverage['id'],
                    'name' => $coverage['name'],
                    'selected' => true,
                    'insuranceAmount' => AxiomTravelInsuranceAdditionalCoverageAmount::find($coverage['insurance_amount'])->axiom_id,
                ];
            })->toArray(),
            'productDiscounts' => collect($this->input('discounts'))->map(function ($discount) {
                return [
                    'discount_id' => $discount['id'],
                    'discount' => $discount['discount'],
                ];
            })->toArray(),
            'isMultiTravel' => $this->input('is_multi_travel', false),
            'maxDaysPerTravel' => $this->input('max_days_per_travel', 0),
            'customerGroups' => collect($this->input('customer_groups'))->map(function ($group) {
                return [
                    'travelCustomerGroupId' => AxiomTravelInsuranceCustomerGroup::find($group['id'])->axiom_id,
                    'count' => $group['count'],
                    'countUnder14' => $group['count_under_14'] ?? 0,
                    'countUnder18' => $group['count_under_18'] ?? 0,
                    'countUnder26' => $group['count_under_26'] ?? 0,
                    'insuranceAmount' => AxiomTravelInsuranceAmount::find($group['insurance_amount'])->axiom_id,
                ];
            })->toArray(),
        ]);
    }
}
