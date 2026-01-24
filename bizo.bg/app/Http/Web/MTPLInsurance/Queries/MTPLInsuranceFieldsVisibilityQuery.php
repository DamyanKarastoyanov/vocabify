<?php

namespace App\Http\Web\MTPLInsurance\Queries;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MTPLInsuranceFieldsVisibilityQuery
{
    protected $mtplInsuranceStep;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request
    ) {
        $this->mtplInsuranceStep = $request->input('step') ?? 1;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch ($this->mtplInsuranceStep) {
            case 1:
                return [
                    'vehicle' => Auth::check() ? true : false,
                    'number' => true,
                    'talon' => true,
                ];
            case 2:
                return [
                    'model_name' => true,
                    'mark_name' => true,
                    'vin' => true,
                    'wheel_direction' => true,
                    'policy_start_date' => true,
                    'policy_installments' => true,
                    'driver_experience' => true,
                    'vehicle_usage' => true,
                    'engine_volume' => true,
                    'engine_power_kw' => true,
                    //additional fields of calculate-price step
                    'gross_weight' => true,
                    'vehicle_places' => true,
                    'birth_date' => true,
                    'location_id' => true,
                    'address' => true,
                    'nationality' => true,
                ];
            case 4:
                return [
                    'first_name' => true,
                    'last_name' => true,
                    'insured_phone' => true,
                    'insured_email' => true,
                    'profile' => Auth::check() ? true : false,
                ];
            case 5:
                return [
                    'payment_method' => true,
                ];
        }

        return [];
    }
}
