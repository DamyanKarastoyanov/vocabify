<?php

namespace App\Http\Web\TravelInsurance\Queries;

use Domain\Users\Models\Person;
use Domain\Axiom\Global\Models\AxiomBank;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceCustomerGroup;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceDestination;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverage;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverageAmount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TravelInsuranceValidFieldValuesQuery
{
    protected $travelInsuranceStep;
    /**
     * Constructor.
     *
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->travelInsuranceStep = $request->input('step', '1');
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch($this->travelInsuranceStep) {
            case '1':
                $result = [
                    'currency' => $this->getCurrencies(),
                    'destination' => $this->getDestinations(),
                    'travel_type' => $this->getTravelTypes(),
                    'insurance_amount' => $this->getInsuranceAmounts(),
                    'customer_group' => $this->getCustomerGroups(),
                    'additional_risks' => $this->getAdditionalRisks(),
                ];

                $result = array_merge($result, $this->getDynamicAdditionalRiskAmounts());

                return $result;
            case '2':
                return [
                    'profile' => $this->getUserProfile(),
                    'persons' => $this->getPersons(),
                    'customer_personal_identification_number_type' => $this->getCustomerPersonalIdentificationNumberTypes(),
                    'customer_district' => $this->getDistricts(),
                ];
            case '2.5':
                return [
                    'profile' => $this->getUserProfile(),
                    'customer_personal_identification_number_type' => $this->getCustomerPersonalIdentificationNumberTypes(),
                    'customer_district' => $this->getDistricts(),
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

    protected function getDistricts(): array
    {
        return AxiomDistrict::selectOptions();
    }

    protected function getCurrencies(): array
    {
        return AxiomCurrency::selectOptions(
            query: AxiomCurrency::query()
                ->whereHas('insuranceTypes', function ($query) {
                    $query->where('axiom_id', AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID);
                })
                ->orderBy('name', 'asc'),
        );
    }

    protected function getDestinations(): array
    {
        return AxiomTravelInsuranceDestination::selectOptions();
    }

    protected function getTravelTypes(): array
    {
        return AxiomTravelInsuranceTravelType::selectOptions(
            query: AxiomTravelInsuranceTravelType::query()->orderBy('id', 'asc')
        );
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

    protected function getInsuranceAmounts(): array
    {
        return AxiomTravelInsuranceAmount::selectOptions(
            query: AxiomTravelInsuranceAmount::query()->orderBy('id', 'asc')
        );
    }

    protected function getCustomerGroups(): array
    {
        return AxiomTravelInsuranceCustomerGroup::selectOptions(
            query: AxiomTravelInsuranceCustomerGroup::query()->orderBy('id', 'asc')
        );
    }

    protected function getAdditionalRisks(): array
    {
        return AxiomTravelInsuranceAdditionalCoverage::selectOptions(
            query: AxiomTravelInsuranceAdditionalCoverage::query()->orderBy('id', 'asc')
        );
    }

    protected function getAdditionalRiskAmounts(int $additionalRiskId): array
    {
        return AxiomTravelInsuranceAdditionalCoverageAmount::selectOptions(
            query: AxiomTravelInsuranceAdditionalCoverageAmount::query()
                ->whereHas('axiomTravelInsuranceAdditionalCoverages', function ($query) use ($additionalRiskId) {
                    $query->where('axiom_travel_insurance_additional_coverages.id', $additionalRiskId);
                })
                ->orderBy('id', 'asc')
        );
    }

    protected function getDynamicAdditionalRiskAmounts(): array
    {
        $additionalRiskAmounts = [];

        $additionalCoverages = AxiomTravelInsuranceAdditionalCoverage::all();

        foreach ($additionalCoverages as $coverage) {
            $fieldKey = "additional_risk_{$coverage->axiom_id}_amount";
            $additionalRiskAmounts[$fieldKey] = $this->getAdditionalRiskAmounts($coverage->axiom_id);
        }

        return $additionalRiskAmounts;
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
                'latin_full_name' => $userProfile->latin_full_name,
                'is_student' => $userProfile->is_student,
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
                'profile.is_student as is_student',
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
                    'is_student' => $profile->is_student,
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
}
