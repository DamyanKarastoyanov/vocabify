<?php

namespace App\Http\Web\MTPLInsurance\Queries;

use Carbon\Carbon;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceVehicleUsage;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceLocation;
use Illuminate\Http\Request;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Support\Facades\Auth;

class MTPLInsuranceSelectedValuesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    public function get(): array
    {
        $defaultVehicleUsage = BroqeeMTPLInsuranceVehicleUsage::query()
            ->where('broqee_id', 1)
            ->first();

        $defaultLocation = BroqeeMTPLInsuranceLocation::where('zip', 1000)->first();

        $result = [
            'wheel_direction' => [
                'label' => 'Ляв',
                'value' => 1,
            ],
            'vehicle_usage' => [
                'label' => $defaultVehicleUsage->name,
                'value' => $defaultVehicleUsage->broqee_id,
            ],
            'policy_start_date' => Carbon::now()->addDay()->format('Y-m-d H:i:s'),
            'payment_method' => [
                'label' => 'Плащане с карта',
                'value' => 'card',
            ],
            'location_id' => [
                'value' => $defaultLocation->broqee_id,
                'label' => $defaultLocation->region
                    ? "{$defaultLocation->city}, {$defaultLocation->region} {$defaultLocation->zip}"
                    : $defaultLocation->city,
            ],
        ];

        if(Auth::check()) {
            $user = Auth::user();

            if ($user->profile) {
                $result['profile'] = [
                    'value' => $user->id,
                    'label' => $user->profile->first_name . ' ' . $user->profile->last_name,
                ];
                $result['first_name'] = $user->profile->first_name;
                $result['last_name'] = $user->profile->last_name;
                $result['insured_names'] = $user->fullName;
                $result['insured_phone'] = $user->profile->phone;
                $result['insured_email'] = $user->email;
            }
        }

        return $result;
    }
}
