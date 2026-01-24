<?php

namespace App\Http\Web\MTPLInsurance\Queries;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceVehicleUsage;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceLocation;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MTPLInsuranceValidFieldValuesQuery
{
    protected $MTPLInsuranceStep;
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->MTPLInsuranceStep = $request->input('step', '1');
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch($this->MTPLInsuranceStep) {
            case '1':
                return [
                    'vehicle' => $this->getVehicles(),
                ];
            case '2':
                return [
                    'wheel_direction' => $this->getWheelDirections(),
                    'vehicle_usage' => BroqeeMTPLInsuranceVehicleUsage::selectOptions(value: 'broqee_id'),
                    'policy_installments' => $this->getPolicyInstallments(),
                    'driver_experience' => $this->getDriverExperienceOptions(),
                    'location_id' => $this->getLocations(),
                ];
            case '3':
                return [];
            case '4':
                return [
                    'profile' => $this->getUserProfile(),
                ];
            case '5':
                return [
                    'payment_method' => [
                        ['value' => 'card', 'label' => 'Плащане с карта'],
                        ['value' => 'bank_transfer', 'label' => 'Плащане по банков път'],
                    ],
                ];
            default:
                return [];
        }
    }

    protected function getWheelDirections(): array
    {
        return [
            [
                'value' => 1,
                'label' => 'Ляв',
            ],
            [
                'value' => 2,
                'label' => 'Десен',
            ]
        ];
    }

    protected function getPolicyInstallments(): array
    {
        return [
            [
                'value' => 1,
                'label' => '1 вноска',
            ],
            [
                'value' => 2,
                'label' => '2 вноски',
            ],
            [
                'value' => 4,
                'label' => '4 вноски',
            ]
        ];
    }

    protected function getDriverExperienceOptions(): array
    {
        return [
            ['value' => 1, 'label' => 'До 1 година'],
            ['value' => 3, 'label' => '1-3 години'],
            ['value' => 5, 'label' => '3-5 години'],
            ['value' => 10, 'label' => '5-10 години'],
            ['value' => 11, 'label' => 'Над 10 години'],
        ];
    }

    protected function getLocations(): array
    {
        return BroqeeMTPLInsuranceLocation::query()
            ->select(['broqee_id', 'city', 'region','zip'])
            ->orderBy('zip', 'asc')
            ->get()
            ->map(fn ($location) => [
                'value' => $location->broqee_id,
                'label' => $location->region
                    ? "{$location->city}, {$location->region} {$location->zip}"
                    : $location->city,
            ])
            ->toArray();
    }

    protected function getUserProfile(): array
    {
        $user = Auth::user();
        if (!$user) {
            return [];
        }

        if ($user->profile) {
            $userProfile = $user->profile;

            return [
                [
                    'value' => $user->id,
                    'label' => $userProfile->first_name . ' ' . $userProfile->last_name,
                    'first_name' => $userProfile->first_name,
                    'last_name' => $userProfile->last_name,
                    'insured_phone' => $userProfile->phone,
                    'insured_email' => $user->email,
                    'location' =>  BroqeeMTPLInsuranceLocation::where('zip', $user?->profile?->address?->postal_code)->first()
                ],
                [
                    'value' => 0,
                    'label' => 'Нов профил',
                ]
            ];
        }

        return [];
    }
    protected function getVehicles(): array
    {
        $user = Auth::user();
        if (!$user) {
            return [];
        }

        $vehicles = Vehicle::query()
            ->with('specification')
            ->whereHas('users', fn($query) => $query->where('users.id', Auth::id()))
            ->get()
            ->map(function ($vehicle) {
                return [
                    'value' => $vehicle->id,
                    'label' => $vehicle->title,
                    'number' => $vehicle->reg_number,
                    'talon' => $vehicle->talon,
                ];
            })
            ->toArray();

        // Add "New vehicle" option
        $vehicles = array_merge( $vehicles, [
            [
                'value' => 0,
                'label' => 'Нов автомобил',
            ]
        ]);

        return $vehicles;
    }
}

