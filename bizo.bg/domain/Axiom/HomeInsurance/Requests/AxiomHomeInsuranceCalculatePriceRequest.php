<?php

namespace Domain\Axiom\HomeInsurance\Requests;

use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePeriod;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AxiomHomeInsuranceCalculatePriceRequest extends FormRequest
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
            'insurance_type_id' => 'required',
            'installment' => 'required|integer',
            'start_date' => 'required|date_format:Y-m-d H:i:s',
            'period' => 'required|integer',
            'packages' => 'required|array',
            'packages.*.package_id' => 'required|integer',
            'packages.*.insurance_amount' => 'required|numeric|min:0',
            'packages.*.package_name' => 'required|string',
            'discounts' => 'sometimes|array',
            'discounts.*.discount_id' => 'required|integer',
            'discounts.*.discount' => 'required|numeric|min:0',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'insurance_type_id' => AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID,
            'currency' => AxiomCurrency::find($this->input('currency'))->axiom_id,
            'installment' => AxiomInstallmentType::find($this->input('installment'))->axiom_id,
            'start_date' => Carbon::parse($this->input('start_date'))->format('Y-m-d H:i:s'),
            'period' => AxiomHomeInsurancePeriod::find($this->input('period'))->axiom_id,
            'packages' => collect($this->input('packages'))->map(function ($package) {
                return [
                    'package_id' => $package['id'],
                    'insurance_amount' => $package['insurance_amount'],
                    'package_name' => $package['package_name'],
                ];
            })->toArray(),
            'discounts' => collect($this->input('discounts'))->map(function ($discount) {
                return [
                    'discount_id' => $discount['id'],
                    'discount' => $discount['discount'],
                ];
            })->toArray(),
        ]);
    }
}
