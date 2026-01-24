<?php

namespace App\Http\Web\HomeInsurance\Queries;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class HomeInsuranceFieldsVisibilityQuery
{
    protected $HomeInsuranceStep;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request
    ) {
        $this->HomeInsuranceStep = $request->input('step') ?? 1;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch ($this->HomeInsuranceStep) {
            case '1':
                return [
                    'packages' => true,
                    //'discounts' => true,
                    'installment' => true,
                    'start_date' => true,
                    'period' => true,
                    'currency' => true,
                ];
            case '2':
                return [
                    'property' => Auth::check() ? true : false,
                    'district' => true,
                    'municipality' => true,
                    'town' => true,
                    'postcode' => true,
                    'property_address' => true,
                    'property_size' => true,
                ];
            case '3':
                return [
                    'profile' => Auth::check() ? true : false,
                    'customer_personal_identification_number_type' => true,
                    'customer_personal_identification_number' => true,
                    'first_name' => true,
                    'middle_name' => true,
                    'last_name' => true,
                    'customer_district' => true,
                    'customer_municipality' => true,
                    'customer_town' => true,
                    'customer_postcode' => true,
                    'customer_address' => true,
                    'phone_number' => true,
                    'mobile_phone' => true,
                    'email' => true,
                    'is_third_party_beneficiary' => true,
                ];
            case '3.5':
                return [
                    'customer_personal_identification_number_type' => true,
                    'customer_personal_identification_number' => true,
                    'first_name' => true,
                    'middle_name' => true,
                    'last_name' => true,
                    'customer_district' => true,
                    'customer_municipality' => true,
                    'customer_town' => true,
                    'customer_postcode' => true,
                    'customer_address' => true,
                    'phone_number' => true,
                    'mobile_phone' => true,
                    'email' => true,
                    'bank' => true,
                ];
            case '4':
                return [
                    'payment_method' => true,
                ];
        }

        return [];
    }
}
