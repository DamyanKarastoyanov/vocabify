<?php

namespace Domain\Axiom\TravelInsurance\Requests;

use Domain\Axiom\Global\Models\AxiomAgent;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomCustomerType;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomOffice;
use Domain\Axiom\Global\Models\AxiomOfficeRegion;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverageAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceDestination;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelTypeActivity;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AxiomTravelInsuranceGetOfferRequest extends FormRequest
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
            'officeRegionId' => 'required|exists:axiom_office_regions,axiom_id',
            'officeId' => 'required|exists:axiom_offices,axiom_id',
            'agentId' => 'required|exists:axiom_agents,axiom_id',
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
            'customerGroups.*.insuredCustomers' => 'required|array',
            'customerGroups.*.insuredCustomers.*.customerId' => 'sometimes|integer',
            'customerGroups.*.insuredCustomers.*.pinType' => 'required|exists:axiom_personal_identification_number_types,axiom_id',
            'customerGroups.*.insuredCustomers.*.pin' => 'required|string|max:20',
            'customerGroups.*.insuredCustomers.*.firstName' => 'required|string|max:255',
            'customerGroups.*.insuredCustomers.*.lastName' => 'nullable|string|max:255',
            'customerGroups.*.insuredCustomers.*.latinFullName' => 'required|string|max:255',
            'customerGroups.*.insuredCustomers.*.isStudent' => 'sometimes|boolean',
            'customerGroups.*.insuredCustomers.*.travelCustomerGroupId' => 'required|exists:axiom_travel_insurance_customer_groups,axiom_id',
            'customerGroups.*.insuredCustomers.*.birthDate' => 'nullable|date|required_if:customerGroups.*.insuredCustomers.*.pinType,FIN,IND',
            'insurer.customerTypeId' => 'sometimes|exists:axiom_customer_types,axiom_id',
            'insurer.pinType' => 'required|exists:axiom_personal_identification_number_types,axiom_id',
            'insurer.pin' => 'required|string|max:20',
            'insurer.firstName' => 'required|string|max:255',
            'insurer.lastName' => 'nullable|string|max:255',
            'insurer.districtId' => 'required|exists:axiom_districts,axiom_id',
            'insurer.municipalityId' => 'required|exists:axiom_municipalities,axiom_id',
            'insurer.townId' => 'required|exists:axiom_towns,axiom_id',
            'insurer.address' => 'required|string|max:255',
            'insurer.mobilePhone' => 'required|string|max:20',
            'insurer.postCode' => 'required|string|max:20',
            'insurer.email' => 'required|email|max:255',
        ];
    }

    protected function prepareForValidation(): void
    {
        $insurer = $this->input('insurer', []);

        $this->merge([
            'officeRegionId' => AxiomOfficeRegion::DEFAULT_OFFICE_REGION_ID,
            'officeId' => AxiomOffice::DEFAULT_OFFICE_ID,
            'agentId' => AxiomAgent::DEFAULT_AGENT_ID,
            'insuranceTypeId' => AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID,
            'currencyCode' => AxiomCurrency::find($this->input('currency'))->axiom_id,
            'numberOfInstallments' => AxiomInstallmentType::DEFAULT_INSTALLMENT_TYPE_AXIOM_ID,
            'beginDate' => Carbon::parse($this->input('start_date'))->toIso8601ZuluString(),
            'endDate' => Carbon::parse($this->input('end_date'))->toIso8601ZuluString(),
            'travelTypeId' => AxiomTravelInsuranceTravelType::find($this->input('travel_type'))->axiom_id,
            'travelTypeActivityId' => $this->input('travel_type_activity') ? AxiomTravelInsuranceTravelTypeActivity::find($this->input('travel_type_activity'))?->axiom_id : null,
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
                    'travelCustomerGroupId' => $group['id'],
                    'count' => $group['count'] ?? 1,
                    'countUnder14' => $group['count_under_14'] ?? 0,
                    'countUnder18' => $group['count_under_18'] ?? 0,
                    'countUnder26' => $group['count_under_26'] ?? 0,
                    'insuranceAmount' => $group['insurance_amount'],
                    'insuredCustomers' => collect($group['insured_customers'] ?? [])->map(function ($customer, $index) use ($group) {
                        return [
                            'customerId' => $index + 1, // Assuming customerId is not provided, use index + 1
                            'pinType' => AxiomPersonalIdentificationNumberType::find($customer['pin_type'])->axiom_id,
                            'pin' => $customer['pin'],
                            'firstName' => $customer['first_name'],
                            'lastName' => $customer['last_name'] ?? "",
                            'latinFullName' => $customer['latin_full_name'],
                            'travelCustomerGroupId' => $group['id'],
                            'isStudent' => $customer['is_student'] ?? false,
                            'birthDate' => isset($customer['birth_date']) ? Carbon::parse($customer['birth_date'])->toIso8601ZuluString() : null,
                        ];
                    })->toArray(),
                ];
            })->toArray(),
            'insurer' => [
                'customerTypeId' => $insurer['customer_type_id'] ?? AxiomCustomerType::INSURER_CUSTOMER_TYPE_ID,
                'pinType' => AxiomPersonalIdentificationNumberType::find($insurer['pin_type'])->axiom_id,
                'pin' => $insurer['pin'],
                'firstName' => $insurer['first_name'],
                'lastName' => $insurer['last_name'] ?? "",
                'districtId' => AxiomDistrict::find($insurer['district_id'])->axiom_id,
                'municipalityId' => AxiomMunicipality::find($insurer['municipality_id'])->axiom_id,
                'townId' => AxiomTown::find($insurer['town_id'])->axiom_id,
                'address' => $insurer['address'],
                'mobilePhone' => $insurer['mobile_phone'],
                'postCode' => $insurer['post_code'],
                'email' => $insurer['email'],
            ],
        ]);
    }
}
