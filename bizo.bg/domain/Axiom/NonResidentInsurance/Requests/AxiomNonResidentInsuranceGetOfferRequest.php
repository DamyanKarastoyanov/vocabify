<?php

namespace Domain\Axiom\NonResidentInsurance\Requests;

use Domain\Axiom\Global\Models\AxiomAgent;
use Domain\Axiom\Global\Models\AxiomCountry;
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
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePeriod;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AxiomNonResidentInsuranceGetOfferRequest extends FormRequest
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
            'period' => 'required|integer',
            // 'productDiscounts' => 'array',
            // 'productDiscounts.*.id' => 'required|exists:axiom_travel_insurance_discounts,axiom_id',
            // 'productDiscounts.*.discount' => 'required|numeric|min:0|max:100',
            'customerGroups' => 'required|array',
            'customerGroups.*.customerGroupId' => 'required|exists:axiom_non_resident_insurance_customer_groups,axiom_id',
            'customerGroups.*.count' => 'required|integer|min:1',
            'customerGroups.*.insuredCustomers' => 'required|array',
            'customerGroups.*.insuredCustomers.*.customerId' => 'sometimes|integer',
            'customerGroups.*.insuredCustomers.*.pinType' => 'required|exists:axiom_personal_identification_number_types,axiom_id',
            'customerGroups.*.insuredCustomers.*.pin' => 'required|string|max:20',
            'customerGroups.*.insuredCustomers.*.firstName' => 'required|string|max:255',
            'customerGroups.*.insuredCustomers.*.lastName' => 'nullable|string|max:255',
            'customerGroups.*.insuredCustomers.*.latinFullName' => 'required|string|max:255',
            'customerGroups.*.insuredCustomers.*.customerGroupId' => 'required|exists:axiom_non_resident_insurance_customer_groups,axiom_id',
            'customerGroups.*.insuredCustomers.*.districtId' => 'required|exists:axiom_districts,axiom_id',
            'customerGroups.*.insuredCustomers.*.municipalityId' => 'required|exists:axiom_municipalities,axiom_id',
            'customerGroups.*.insuredCustomers.*.townId' => 'required|exists:axiom_towns,axiom_id',
            'customerGroups.*.insuredCustomers.*.countryId' => 'required|exists:axiom_countries,axiom_id',
            'customerGroups.*.insuredCustomers.*.address' => 'required|string|max:255',
            'customerGroups.*.insuredCustomers.*.postCode' => 'required|string|max:20',
            'customerGroups.*.insuredCustomers.*.birthDate' => 'nullable|date|required_if:customerGroups.*.insuredCustomers.*.pinType,FIN,IND',
            'insurer.customerTypeId' => 'sometimes|exists:axiom_customer_types,axiom_id',
            'insurer.pinType' => 'required|exists:axiom_personal_identification_number_types,axiom_id',
            'insurer.pin' => 'required|string|max:20',
            'insurer.firstName' => 'required|string|max:255',
            'insurer.lastName' => 'nullable|string|max:255',
            'insurer.latinFullName' => 'required|string|max:255',
            'insurer.districtId' => 'required|exists:axiom_districts,axiom_id',
            'insurer.municipalityId' => 'required|exists:axiom_municipalities,axiom_id',
            'insurer.townId' => 'required|exists:axiom_towns,axiom_id',
            'insurer.address' => 'required|string|max:255',
            'insurer.mobilePhone' => 'sometimes|string|max:20',
            'insurer.postCode' => 'required|string|max:20',
            'insurer.email' => 'required|string|email|max:255',
        ];
    }

    protected function prepareForValidation(): void
    {
        $insurer = $this->input('insurer', []);

        $this->merge([
            'officeRegionId' => AxiomOfficeRegion::DEFAULT_OFFICE_REGION_ID,
            'officeId' => AxiomOffice::DEFAULT_OFFICE_ID,
            'agentId' => AxiomAgent::DEFAULT_AGENT_ID,
            'insuranceTypeId' => AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID,
            'currencyCode' => AxiomCurrency::find($this->input('currency'))->axiom_id,
            'numberOfInstallments' => AxiomInstallmentType::DEFAULT_INSTALLMENT_TYPE_AXIOM_ID,
            'period' => AxiomNonResidentInsurancePeriod::find($this->input('period'))->axiom_id,
            'beginDate' => Carbon::parse($this->input('start_date'))->toIso8601ZuluString(),
            // 'productDiscounts' => collect($this->input('discounts'))->map(function ($discount) {
            //     return [
            //         'discount_id' => $discount['id'],
            //         'discount' => $discount['discount'],
            //     ];
            // })->toArray(),
            'customerGroups' => collect($this->input('customer_groups'))->map(function ($group) {
                return [
                    'customerGroupId' => $group['id'],
                    'count' => $group['count'] ?? 1,
                    'insuredCustomers' => collect($group['insured_customers'] ?? [])->map(function ($customer, $index) use ($group) {
                        return [
                            'customerId' => $index + 1, // Assuming customerId is not provided, use index + 1
                            'pinType' => AxiomPersonalIdentificationNumberType::find($customer['pin_type'])->axiom_id,
                            'pin' => $customer['pin'],
                            'firstName' => $customer['first_name'],
                            'lastName' => $customer['last_name'] ?? "",
                            'latinFullName' => $customer['latin_full_name'],
                            'customerGroupId' => $group['id'],
                            'districtId' => AxiomDistrict::find($customer['district_id'])->axiom_id,
                            'municipalityId' => AxiomMunicipality::find($customer['municipality_id'])->axiom_id,
                            'townId' => AxiomTown::find($customer['town_id'])->axiom_id,
                            'countryId' => AxiomCountry::find($customer['country_id'])->axiom_id,
                            'address' => $customer['address'],
                            'postCode' => $customer['post_code'] ?? '1234',
                            'mobilePhone' => $customer['mobile_phone'] ?? '',
                            'hasForeignPhoneNumber' =>  isset($customer['mobile_phone']) ? false : true,
                            'isMobilePhoneBulgarian' => isset($customer['mobile_phone']) ? true : false,
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
                'latinFullName' => $insurer['latin_full_name'] ?? '',
                'districtId' => AxiomDistrict::find($insurer['district_id'])->axiom_id,
                'municipalityId' => AxiomMunicipality::find($insurer['municipality_id'])->axiom_id,
                'townId' => AxiomTown::find($insurer['town_id'])->axiom_id,
                'address' => $insurer['address'],
                'mobilePhone' => $insurer['mobile_phone'] ?? '',
                'postCode' => $insurer['post_code'],
                'email' => $insurer['email'] ?? '',
            ],
        ]);
    }
}
