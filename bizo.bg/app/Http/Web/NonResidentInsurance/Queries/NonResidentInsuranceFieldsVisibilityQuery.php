<?php

namespace App\Http\Web\NonResidentInsurance\Queries;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NonResidentInsuranceFieldsVisibilityQuery
{
    protected $nonResidentInsuranceStep;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request
    ) {
        $this->nonResidentInsuranceStep = $request->input('step') ?? 1;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch ($this->nonResidentInsuranceStep) {
            case '1':
                return [
                    'start_date' => true,
                    'period' => true,
                    'currency' => true,
                    'customer_group' => true,
                    'number_of_passengers' => true,
                    'installment' => true,
                ];
            case '2':
                return [
                    'profile' => Auth::check() ? true : false,
                    'persons' => Auth::check() ? true : false,
                    'personal_identification_number_type' => true,
                    'personal_identification_number' => true,
                    'first_name' => true,
                    'last_name' => true,
                    'country' => true,
                    'district' => true,
                    'municipality' => true,
                    'town' => true,
                    'postcode' => true,
                    'address' => true,
                    'mobile_phone' => true,
                    'email' => true,
                    'is_insurer_also_a_customer' => true,
                    'latin_full_name' => true,
                    'birth_date' => true,
                    'is_mobile_number_available' => true,
                ];
            case '2.5':
                return [
                    'profile' => Auth::check() ? true : false,
                    'personal_identification_number_type' => true,
                    'personal_identification_number' => true,
                    'first_name' => true,
                    'last_name' => true,
                    'country' => true,
                    'district' => true,
                    'municipality' => true,
                    'town' => true,
                    'postcode' => true,
                    'address' => true,
                    'mobile_phone' => true,
                    'is_mobile_number_available' => true,
                    'latin_full_name' => true,
                    'email' => true,
                ];
            case '3':
                return [
                    'payment_method' => true,
                ];
        }

        return [];
    }
}
