<?php

namespace App\Http\Web\HomeInsurance\Queries;

use Domain\Axiom\Global\Models\AxiomBank;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePeriod;
use Domain\Axiom\Global\DataTransferObjects\AxiomPackageDTO;
use Domain\Axiom\Global\DataTransferObjects\AxiomDiscountDTO;
use Domain\Users\Models\Property;
use Domain\Users\Models\Person;
use Illuminate\Support\Facades\Auth;
use App\Facades\HomeInsuranceGateway;
use Illuminate\Http\Request;

class HomeInsuranceValidFieldValuesQuery
{
    protected $HomeInsuranceStep;
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->HomeInsuranceStep = $request->input('step', '1');
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch($this->HomeInsuranceStep) {
            case '1':
                return[
                    'packages' => $this->getPackages(),
                    //'discounts' => $this->getDiscounts(),
                    'period' => $this->getPeriods(),
                    'currency' => $this->getCurrencies(),
                    'installment' => $this->getInstallments(),
                ];
            case '2':
                return [
                    'property' => $this->getProperties(),
                    'district' => $this->getDistricts(),
                ];
            case '3':
                return [
                    'profile' => $this->getUserProfile(),
                    'customer_personal_identification_number_type' => $this->getCustomerPersonalIdentificationNumberTypes(),
                    'customer_district' => $this->getDistricts(),
                ];
            case '3.5':
                return [
                    'profile' => $this->getProfiles(),
                    'customer_personal_identification_number_type' => $this->getCustomerPersonalIdentificationNumberTypes(),
                    'customer_district' => $this->getDistricts(),
                    'bank' => $this->getBanks(),
                ];
            case '4':
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

    protected function getDistricts(): array
    {
        return AxiomDistrict::selectOptions();
    }

    protected function getPeriods(): array
    {
        return AxiomHomeInsurancePeriod::selectOptions(AxiomHomeInsurancePeriod::query());
    }

    protected function getCurrencies(): array
    {
        return AxiomCurrency::selectOptions(
            query: AxiomCurrency::query()
                ->whereHas('insuranceTypes', function ($query) {
                    $query->where('axiom_id', AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID);
                })
                ->orderBy('name', 'asc'),
        );
    }

    protected function getInstallments(): array
    {
        return AxiomInstallmentType::selectOptions(AxiomInstallmentType::query());
    }

    protected function getCustomerPersonalIdentificationNumberTypes(): array
    {
        return AxiomPersonalIdentificationNumberType::selectOptions();
    }

    protected function getBanks(): array
    {
        return AxiomBank::selectOptions(
            query: AxiomBank::query()
        );
    }

    protected function getPackages(): array
    {
        return AxiomPackageDTO::collect(HomeInsuranceGateway::getPackages());
    }

    protected function getDiscounts(): array
    {
        return AxiomDiscountDTO::collect(HomeInsuranceGateway::getDiscounts());
    }

    protected function getProperties(): array
    {
        $baseQuery = Property::query()
        ->leftJoin('addresses as address', function ($join) {
            $join->on('address.id', '=', 'properties.address_id')
                ->whereNull('address.deleted_at');
        })
        ->leftJoin('axiom_districts as district', function ($join) {
            $join->on('district.id', '=', 'address.district_id');
        })
        ->leftJoin('axiom_municipalities as municipality', function ($join) {
            $join->on('municipality.id', '=', 'address.municipality_id');
        })
        ->leftJoin('axiom_towns as town', function ($join) {
            $join->on('town.id', '=', 'address.town_id');
        })
        ->addSelect(
            'properties.id as id',
            'properties.gross_floor_area_m2 as gross_floor_area',
            'address.address as address',
            'address.postal_code as postal_code',
            'town.id as town_id',
            'municipality.id as municipality_id',
            'district.id as district_id'
        )
        ->selectRaw('
            CONCAT(
                address.address,
                IFNULL(CONCAT(", гр.", town.name), ""),
                IFNULL(CONCAT(", община ", municipality.name), ""),
                IFNULL(CONCAT(", област ", district.name), "")
            ) as label
        ')
        ->where('properties.user_id', Auth::id());

        $properties = Property::query()
        ->withTrashed()
        ->fromSub($baseQuery, 'sub')
        ->get()
        ->map(function ($property) {
            return [
                'value' => $property->id,
                'label' => $property->label,
                'address' => $property->address,
                'postal_code' => $property->postal_code,
                'town_id' => $property->town_id,
                'municipality_id' => $property->municipality_id,
                'district_id' => $property->district_id,
                'gross_floor_area' => $property->gross_floor_area,
            ];
        })
        ->toArray();

        if (count($properties) === 0) {
            return [
                [
                    'value' => 0,
                    'label' => 'Нов имот',
                ]
            ];
        }

        $properties = array_merge($properties, [
            [
                'value' => 0,
                'label' => 'Нов имот',
            ]
        ]);

        return $properties;
    }

    protected function getProfiles(): array
    {
        $baseQuery = Person::query()
            ->leftJoin('profiles as profile', function ($join) {
                $join->on('profile.id', '=', 'persons.profile_id')
                    ->whereNull('profile.deleted_at');
            })
            ->leftJoin('addresses as address', function ($join) {
                $join->on('address.id', '=', 'profile.address_id')
                    ->whereNull('address.deleted_at');
            })
            ->addSelect(
                'persons.id',
                'profile.first_name as first_name',
                'profile.last_name as last_name',
                'profile.personal_identification_number as personal_identification_number',
                'profile.personal_identification_number_type_id as personal_identification_number_type_id',
                'address.address as address',
                'address.postal_code as postal_code',
                'address.town_id as town_id',
                'address.municipality_id as municipality_id',
                'address.district_id as district_id',
                'profile.phone as mobile_phone',
            )
            ->where('persons.user_id', Auth::id());

                 $personProfiles = Person::query()
            ->withTrashed()
            ->fromSub($baseQuery, 'sub')
            ->get()
            ->map(function ($profile) {
                return [
                    'value' => $profile->id,
                    'label' => $profile->first_name . ' ' . $profile->last_name,
                    'personal_identification_number' => $profile->personal_identification_number,
                    'personal_identification_number_type' => $profile->personal_identification_number_type_id,
                    'first_name' => $profile->first_name,
                    'last_name' => $profile->last_name,
                    'address' => $profile->address,
                    'postal_code' => $profile->postal_code,
                    'town_id' => $profile->town_id,
                    'municipality_id' => $profile->municipality_id,
                    'district_id' => $profile->district_id,
                    'mobile_phone' => $profile->mobile_phone,
                ];
            })
            ->toArray();

        $profiles = array_merge($personProfiles, [
            [
                'value' => 0,
                'label' => 'Нов профил',
            ]
        ]);

        return $profiles;

    }

    protected function getUserProfile(): array
    {
        $user = Auth::user();
        if ($user && $user->profile) {
            $userProfile = $user->profile;
            $address = $userProfile->address;

            return [
                [
                'value' => $user->id,
                'label' => $userProfile->first_name . ' ' . $userProfile->last_name,
                'first_name' => $userProfile->first_name,
                'last_name' => $userProfile->last_name,
                'personal_identification_number' => $userProfile->personal_identification_number,
                'personal_identification_number_type' => $userProfile->personal_identification_number_type_id,
                'address' => $address ? $address->address : null,
                'postal_code' => $address ? $address->postal_code : null,
                'town_id' => $address ? $address->town_id : null,
                'municipality_id' => $address ? $address->municipality_id : null,
                'district_id' => $address ? $address->district_id : null,
                'mobile_phone' => $userProfile->phone,
                'email' => $user->email, // Email is on the User model, not Profile
                ],
                [
                    'value' => 0,
                    'label' => 'Нов профил',
                ]
            ];
        }

        return [];
    }
}
