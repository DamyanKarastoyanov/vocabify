<?php

namespace App\Http\Web\NonResidentInsurance\Queries;

use Domain\Axiom\Global\Models\AxiomCountry;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceCustomerGroup;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePeriod;
use Domain\Users\Models\Person;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class NonResidentInsuranceValidFieldValuesQuery
{
    protected $nonResidentInsuranceStep;
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->nonResidentInsuranceStep = $request->input('step', '1');
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch($this->nonResidentInsuranceStep) {
            case '1':
                return [
                    'period' => $this->getPeriods(),
                    'currency' => $this->getCurrencies(),
                    'customer_group' => $this->getCustomerGroups(),
                    'installment' => $this->getInstallments(),
                ];
            case '2':
                    return [
                        'profile' => $this->getUserProfile(),
                        'persons' => $this->getPersons(),
                        'personal_identification_number_type' => $this->getCustomerPersonalIdentificationNumberTypes(),
                        'district' => $this->getDistricts(),
                        'country' => $this->getCountries(),
                    ];
            case '2.5':
                return [
                    'profile' => $this->getUserProfile(),
                    'personal_identification_number_type' => $this->getCustomerPersonalIdentificationNumberTypes(),
                    'district' => $this->getDistricts(),
                    'country' => $this->getCountries(),
                ];
            case '3':
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

    protected function getCustomerPersonalIdentificationNumberTypes(): array
    {
        return AxiomPersonalIdentificationNumberType::selectOptions();
    }

    protected function getDistricts(): array
    {
        return AxiomDistrict::selectOptions();
    }

    protected function getPeriods(): array
    {
        return AxiomNonResidentInsurancePeriod::selectOptions(
            query: AxiomNonResidentInsurancePeriod::query()->orderBy('id', 'asc')
        );
    }

    protected function getCountries(): array
    {
        return AxiomCountry::selectOptions();
    }

    protected function getCurrencies(): array
    {
        return AxiomCurrency::selectOptions(
            query: AxiomCurrency::query()
                ->whereHas('insuranceTypes', function ($query) {
                    $query->where('axiom_id', AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID);
                })
                ->orderBy('name', 'asc'),
        );
    }

    protected function getCustomerGroups(): array
    {
        return AxiomNonResidentInsuranceCustomerGroup::selectOptions(
            query: AxiomNonResidentInsuranceCustomerGroup::query()->orderBy('id', 'asc')
        );
    }

    protected function getInstallments(): array
    {
        return AxiomInstallmentType::query()
            ->select('id', 'name')
            ->get()
            ->map(function (AxiomInstallmentType $installmentType) {
                return [
                    'value' => $installmentType->id,
                    'label' => $installmentType->name,
                ];
            })
            ->toArray();
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
                'latin_full_name' => $userProfile->latin_full_name,
                'personal_identification_number' => $userProfile->personal_identification_number,
                'personal_identification_number_type' => $userProfile->personal_identification_number_type_id,
                'address' => $address ? $address->address : null,
                'postal_code' => $address ? $address->postal_code : null,
                'town_id' => $address ? $address->town_id : null,
                'municipality_id' => $address ? $address->municipality_id : null,
                'district_id' => $address ? $address->district_id : null,
                'country_id' => $userProfile->country_id,
                'mobile_phone' => $userProfile->phone,
                'email' => $user->email, // Email is on the User model, not Profile
                'birth_date' => $userProfile->birth_date,
                ],
                [
                    'value' => 0,
                    'label' => 'Нов профил',
                ]
            ];
        }

        return [];
    }

    protected function getPersons(): array
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
                'profile.latin_full_name as latin_full_name',
                'profile.birth_date as birth_date',
                'profile.phone as mobile_phone',
                'address.address as address',
                'address.postal_code as postcode',
                'address.town_id as town_id',
                'address.municipality_id as municipality_id',
                'address.district_id as district_id',
                'profile.country_id as country_id',
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
                    'latin_full_name' => $profile->latin_full_name,
                    'birth_date' => $profile->birth_date,
                    'mobile_phone' => $profile->mobile_phone,
                    'address' => $profile->address,
                    'postcode' => $profile->postcode,
                    'town_id' => $profile->town_id,
                    'municipality_id' => $profile->municipality_id,
                    'district_id' => $profile->district_id,
                    'country_id' => $profile->country_id,
                ];
            })
            ->toArray();

        $profiles = array_merge($personProfiles, [
            [
                'value' => 0,
                'label' => 'Ново застраховано лице',
            ]
        ]);

        return $profiles;

    }
}
