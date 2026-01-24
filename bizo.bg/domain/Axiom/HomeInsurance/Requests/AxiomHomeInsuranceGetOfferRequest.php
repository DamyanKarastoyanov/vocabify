<?php

namespace Domain\Axiom\HomeInsurance\Requests;

use Domain\Axiom\Global\Models\AxiomBank;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomCustomerType;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePeriod;
use Domain\Users\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AxiomHomeInsuranceGetOfferRequest extends FormRequest
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
            'currency' => 'required|string',
            'installment' => 'required|integer',
            'start_date' => 'required|date_format:Y-m-d H:i:s',
            'period' => 'required|integer',
            'packages' => 'required|array',
            'packages.*.package_id' => 'required|integer',
            'packages.*.insurance_amount' => 'required|numeric|min:0',
            'discounts' => 'sometimes|array',
            'discounts.*.discount_id' => 'required|integer',
            'discounts.*.discount' => 'required|numeric|min:0',
            'customers' => 'required|array',
            'customers.*.first_name' => 'required|string',
            'customers.*.last_name' => 'nullable|string',
            'customers.*.personal_identification_number' => 'required',
            'customers.*.personal_identification_number_type' => 'required',
            'customers.*.post_code' => 'required|string',
            'customers.*.town_id' => 'required|integer',
            'customers.*.address' => 'required|string',
            'customers.*.customer_type_id' => 'sometimes|integer',
            'customers.*.middle_name' => 'sometimes|string',
            'customers.*.phone_number' => 'sometimes|string',
            'customers.*.mobile_phone' => 'sometimes|string',
            'customers.*.email' => 'required|email',
            'customers.*.bank_id' => 'sometimes|integer',
            'property.address' => 'required|string',
            'property.post_code' => 'required|string',
            'property.town_id' => 'required|integer',
            'property.property_size' => 'required|numeric|min:0',
        ];
    }

    protected function prepareForValidation()
    {
        // Customer processing logic
        $processedCustomers = [];
        $customerInput = $this->input('customer');
        $thirdPartyCustomerInput = $this->input('third_party_customer');

        if ($customerInput) {
             $mainCustomerProcessed = $this->prepareCustomerData($customerInput, AxiomCustomerType::MAIN_CUSTOMER_TYPE_ID);
             if ($mainCustomerProcessed) $processedCustomers[] = $mainCustomerProcessed;
        }

        if($this->input('bank') && $this->input('bank') !== AxiomBank::CUSTOM_BANK_ID) {
            $bank = AxiomBank::find($this->input('bank'));
            $details = $bank->details;
            $processedCustomers[] = [
                'first_name' => $details->first_name,
                'last_name' => $details->last_name ?? '',
                'personal_identification_number' => $details->personal_identification_number,
                'personal_identification_number_type' => $details->personalIdentificationNumberType->axiom_id,
                'post_code' => $details->postcode,
                'town_id' => $details->town->axiom_id,
                'address' => $details->address,
                'customer_type_id' => AxiomCustomerType::THIRD_PARTY_CUSTOMER_TYPE_ID,
                'middle_name' => '',
                'phone_number' => $details->phone ?? '',
                'mobile_phone' => $details->mobile_phone ?? '',
                'email' => $details->email ?? User::DEFAULT_EMAIL,
                'bank_id' => $bank->axiom_id,
            ];
        } else {
            if ($thirdPartyCustomerInput) {
                $thirdPartyCustomerProcessed = $this->prepareCustomerData($thirdPartyCustomerInput, AxiomCustomerType::THIRD_PARTY_CUSTOMER_TYPE_ID);
                if ($thirdPartyCustomerProcessed) $processedCustomers[] = $thirdPartyCustomerProcessed;
            }
        }

        $this->merge([
            'currency' => AxiomCurrency::find($this->input('currency'))->axiom_id,
            'installment' => AxiomInstallmentType::find($this->input('installment'))->axiom_id,
            'start_date' => Carbon::parse($this->input('start_date'))->format('Y-m-d H:i:s'),
            'period' => AxiomHomeInsurancePeriod::find($this->input('period'))->axiom_id,
            'packages' => collect($this->input('packages'))->map(function ($package) {
                return [
                    'package_id' => $package['id'],
                    'insurance_amount' => $package['insurance_amount'],
                ];
            })->toArray(),
            'discounts' => collect($this->input('discounts'))->map(function ($discount) {
                return [
                    'discount_id' => $discount['id'],
                    'discount' => $discount['discount'],
                ];
            })->toArray(),
            'customers' => $processedCustomers,
            'property' => [
                'address' => $this->input('property_address'),
                'post_code' => $this->input('property_post_code'),
                'town_id' => AxiomTown::find($this->input('property_town_id'))->axiom_id,
                'property_size' => $this->input('property_size'),
            ],
        ]);
    }

    protected function prepareCustomerData($customerData, $defaultCustomerTypeId) {
        if (empty($customerData) || !is_array($customerData)) {
            return null;
        }

        $pinTypeAxiomId = null;
        if (isset($customerData['personal_identification_number_type'])) {
            $pinTypeModel = AxiomPersonalIdentificationNumberType::find($customerData['personal_identification_number_type']);
            if ($pinTypeModel) $pinTypeAxiomId = $pinTypeModel->axiom_id;
        }

        $townAxiomId = null;
        if (isset($customerData['town_id'])) {
            $townModel = AxiomTown::find($customerData['town_id']);
            if ($townModel) $townAxiomId = $townModel->axiom_id;
        }

        $resolvedCustomerTypeId = $customerData['customer_type_id'] ?? $defaultCustomerTypeId;

        return [
            'first_name' => $customerData['first_name'] ?? null,
            'last_name' => $customerData['last_name'] ?? null,
            'personal_identification_number' => $customerData['personal_identification_number'] ?? null,
            'personal_identification_number_type' => $pinTypeAxiomId,
            'post_code' => $customerData['post_code'] ?? null,
            'town_id' => $townAxiomId,
            'address' => $customerData['address'] ?? null,
            'customer_type_id' => $resolvedCustomerTypeId,
            'middle_name' => $customerData['middle_name'] ?? "",
            'phone_number' => $customerData['phone_number'] ?? "",
            'mobile_phone' => $customerData['mobile_phone'] ?? "",
            'email' => $customerData['email'] ?? ($resolvedCustomerTypeId === AxiomCustomerType::THIRD_PARTY_CUSTOMER_TYPE_ID ? User::DEFAULT_EMAIL : ""),
        ];
    }
}
