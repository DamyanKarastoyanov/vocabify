<?php

namespace App\Http\Web\TravelInsurance\Queries;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class TravelInsuranceFieldsVisibilityQuery
{
    protected $travelInsuranceStep;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request
    ) {
        $this->travelInsuranceStep = $request->input('step') ?? 1;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch ($this->travelInsuranceStep) {
            case '1':
                return [
                    'start_date' => true,
                    'end_date' => true,
                    'currency' => true,
                    'destination' => true,
                    'travel_type' => true,
                    'travel_type_activity' => true,
                    'insurance_amount' => true,
                    'customer_group' => true,
                    'number_of_passengers_under_18' => true,
                    'number_of_passengers_under_26' => true,
                    'additional_risks' => true,
                ];
            case '2':
                return [
                    'profile' => Auth::check() ? true : false,
                    'persons' => Auth::check() ? true : false,
                    'customer_personal_identification_number_type' => true,
                    'customer_personal_identification_number' => true,
                    'first_name' => true,
                    'last_name' => true,
                    'customer_district' => true,
                    'customer_municipality' => true,
                    'customer_town' => true,
                    'customer_postcode' => true,
                    'customer_address' => true,
                    'phone_number' => true,
                    'mobile_phone' => true,
                    'email' => true,
                    'is_insurer_also_a_customer' => true,
                    'latin_full_name' => true,
                    'birth_date' => true,
                    'is_student' => true,
                ];
            case '2.5':
                return [
                    'profile' => Auth::check() ? true : false,
                    'customer_personal_identification_number_type' => true,
                    'customer_personal_identification_number' => true,
                    'first_name' => true,
                    'last_name' => true,
                    'customer_district' => true,
                    'customer_municipality' => true,
                    'customer_town' => true,
                    'customer_postcode' => true,
                    'customer_address' => true,
                    'phone_number' => true,
                    'mobile_phone' => true,
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
