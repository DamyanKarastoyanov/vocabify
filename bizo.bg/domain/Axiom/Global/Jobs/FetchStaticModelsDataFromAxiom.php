<?php

namespace Domain\Axiom\Global\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\External\Axiom\AxiomApiClientService;
use App\Services\External\Axiom\Home\AxiomApiHomeInsuranceClientService;
use App\Services\External\Axiom\Travel\AxiomApiTravelInsuranceClientService;
use Domain\Axiom\Global\Models\AxiomAgent;
use Domain\Axiom\Global\Models\AxiomAgentType;
use Domain\Axiom\Global\Models\AxiomBank;
use Domain\Axiom\Global\Models\AxiomBankDetails;
use Domain\Axiom\Global\Models\AxiomCountry;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomCustomerType;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomOffice;
use Domain\Axiom\Global\Models\AxiomOfficeRegion;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePeriod;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverage;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverageAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAmount;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceCustomerGroup;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceDestination;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelTypeActivity;
use Illuminate\Support\Facades\Log;

class FetchStaticModelsDataFromAxiom implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Log::info('Fetching static models data from Axiom');
        $client = app(AxiomApiClientService::class);
        $homeInsuranceClient = app(AxiomApiHomeInsuranceClientService::class);
        $travelInsuranceClient = app(AxiomApiTravelInsuranceClientService::class);

        $countries = $client->getCountries();
        Log::info('Countries: ' . count($countries));
        foreach ($countries as $country) {
            AxiomCountry::updateOrCreate(
                ['axiom_id' => $country['id']],
                [
                    'name' => $country['name'],
                ]
            );
        }

        $districts = $client->getDistricts();
        Log::info('Districts: ' . count($districts));
        foreach ($districts as $district) {
            AxiomDistrict::updateOrCreate(
                ['axiom_id' => $district['id']],
                [
                    'name' => $district['name'],
                    'axiom_country_id' => AxiomCountry::where('name', 'България')->first()->id,
                ]
            );

            $municipalities = $client->getMunicipalities($district['id']);
            foreach ($municipalities as $municipality) {
                AxiomMunicipality::updateOrCreate(
                    ['axiom_id' => $municipality['id']],
                    [
                        'name' => $municipality['name'],
                        'axiom_district_id' => $district['id']
                    ]
                );

                $towns = $client->getTowns($municipality['id']);
                foreach ($towns as $town) {

                    AxiomTown::updateOrCreate(
                        ['axiom_id' => $town['id']],
                        [
                            'name' => $town['name'],
                            'postcode' => $town['desc'],
                            'axiom_municipality_id' => $municipality['id']
                        ]
                    );
                }
            }
        }

        $officeRegions = $client->getOfficeRegions();
        Log::info('Office regions: ' . count($officeRegions));
        foreach ($officeRegions as $region) {
            AxiomOfficeRegion::updateOrCreate(
                ['axiom_id' => $region['id']],
                [
                    'name' => $region['name'],
                ]
            );

            $offices = $client->getOffices($region['id']);
            foreach ($offices as $office) {
                AxiomOffice::updateOrCreate(
                    ['axiom_id' => $office['id']],
                    [
                        'name' => $office['name'],
                        'axiom_office_region_id' => $region['id']
                    ]
                );
            }

            $agentTypes = $client->getAgentTypes($region['id']);
            foreach ($agentTypes as $type) {
                AxiomAgentType::updateOrCreate(
                    ['axiom_id' => $type['id']],
                    [
                        'name' => $type['name'],
                    ]
                );

                foreach ($offices as $office) {
                    $agents = $client->getAgents($type['id'], $office['id']);
                    foreach ($agents as $agent) {
                        AxiomAgent::updateOrCreate(
                            ['axiom_id' => $agent['id']],
                            [
                                'name' => $agent['name'],
                                'external_code' => '',
                                'axiom_agent_type_id' => $type['id']
                            ]
                        );
                    }
                }

            }
        }

        $installmentTypes = $client->getInstallmentTypes();
        Log::info('Installment types: ' . count($installmentTypes));
        foreach ($installmentTypes as $type) {
            AxiomInstallmentType::updateOrCreate(
                ['axiom_id' => $type['id']],
                [
                    'name' => $type['name'],
                ]
            );
        }

        $customerTypes = $client->getCustomerTypes();
        Log::info('Customer types: ' . count($customerTypes));
        foreach ($customerTypes as $type) {
            AxiomCustomerType::updateOrCreate(
                ['axiom_id' => $type['id']],
                [
                    'name' => $type['name'],
                ]
            );
        }

        $pinTypes = $client->getPinTypes();
        Log::info('PIN types: ' . count($pinTypes));
        foreach ($pinTypes as $type) {
            AxiomPersonalIdentificationNumberType::updateOrCreate(
                ['axiom_id' => $type['id']],
                [
                    'name' => $type['name'],
                ]
            );
        }

        $periods = $homeInsuranceClient->getPeriods();
        Log::info('Periods: ' . count($periods));
        foreach ($periods as $period) {
            AxiomHomeInsurancePeriod::updateOrCreate(
                ['axiom_id' => $period['id']],
                [
                    'name' => $period['name'],
                ]
            );
        }

        $insuranceType = AxiomInsuranceType::updateOrCreate(
            ['axiom_id' => AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID],
            [
                'name' => 'AXI HOME',
            ]
        );

        $currencies = $client->getCurrencies(AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID);
        Log::info('Currencies HOME: ' . count($currencies));
        foreach ($currencies as $currency) {
            AxiomCurrency::updateOrCreate(
                ['axiom_id' => $currency['id']],
                [
                    'name' => $currency['name'],
                ]
            );
        }

        $insuranceType->currencies()->sync(
            AxiomCurrency::whereIn('axiom_id', array_column($currencies, 'id'))->pluck('id')
        );

        $insuranceType = AxiomInsuranceType::updateOrCreate(
            ['axiom_id' => AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID],
            [
                'name' => 'AXI TRAVEL',
            ]
        );

        $currencies = $client->getCurrencies(AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID);
        Log::info('Currencies TRAVEL: ' . count($currencies));
        foreach ($currencies as $currency) {
            AxiomCurrency::updateOrCreate(
                ['axiom_id' => $currency['id']],
                [
                    'name' => $currency['name'],
                ]
            );
        }

        $insuranceType->currencies()->sync(
            AxiomCurrency::whereIn('axiom_id', array_column($currencies, 'id'))->pluck('id')
        );

        $policyStatuses = $client->getPolicyStatuses();
        Log::info('Policy statuses: ' . count($policyStatuses));
        foreach ($policyStatuses as $status) {
            AxiomPolicyStatus::updateOrCreate(
                ['axiom_id' => $status['id']],
                [
                    'name' => $status['name'],
                ]
            );
        }

        $banks = $client->getBanks();
        Log::info('Banks: ' . count($banks));
        foreach ($banks as $bankData) {
            $axiomBank = AxiomBank::updateOrCreate(
                ['axiom_id' => $bankData['id']],
                [
                    'name' => $bankData['name'],
                ]
            );

            // Fetch and store bank details
            if ($axiomBank && $axiomBank->axiom_id && $axiomBank->axiom_id > 0) {
                try {
                    $detailsResponse = $client->getBankDetails($axiomBank->axiom_id);

                    $firstName = $detailsResponse['fullName'];
                    $lastName = '';

                    $pinTypeModel = AxiomPersonalIdentificationNumberType::where('axiom_id', $detailsResponse['pinType'])->first();
                    $townModel = AxiomTown::where('axiom_id', $detailsResponse['townId'])->first();
                    $districtModel = AxiomDistrict::where('axiom_id', $detailsResponse['districtId'])->first();
                    $municipalityModel = AxiomMunicipality::where('axiom_id', $detailsResponse['municipalityId'])->first();

                    AxiomBankDetails::updateOrCreate(
                        ['axiom_id' => $detailsResponse['id']], // Unique identifier for the bank details record itself
                        [
                            'axiom_bank_id' => $axiomBank->id, // Foreign key to the axiom_banks table
                            'first_name' => $firstName,
                            'last_name' => $lastName,
                            'personal_identification_number' => $detailsResponse['pin'],
                            'personal_identification_number_type_id' => $pinTypeModel ? $pinTypeModel->id : null,
                            'district_id' => $districtModel ? $districtModel->id : null,
                            'municipality_id' => $municipalityModel ? $municipalityModel->id : null,
                            'town_id' => $townModel ? $townModel->id : null,
                            'address' => $detailsResponse['address'],
                            'phone' => $detailsResponse['phoneNumber'],
                            'mobile_phone' => $detailsResponse['mobilePhone'],
                            'email' => $detailsResponse['email'],
                            'postcode' => $detailsResponse['postCode'],
                        ]
                    );
                } catch (\Exception $e) {
                    Log::error("Failed to fetch or store bank details for bank axiom_id: {$axiomBank->axiom_id}", [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }
        }

        $travelInsuranceCustomerGroups = $travelInsuranceClient->getTravelCustomerGroups()['travelCustomerGroups'];
        Log::info('Travel Insurance Customer Groups: ' . count($travelInsuranceCustomerGroups));
        foreach ($travelInsuranceCustomerGroups as $customerGroupData) {
            $customerGroup = AxiomTravelInsuranceCustomerGroup::updateOrCreate(
                ['axiom_id' => $customerGroupData['id']],
                [
                    'name' => $customerGroupData['name'],
                ]
            );

            $insuranceAmounts = $travelInsuranceClient->getInsuranceAmounts(AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID, $customerGroup->id);
            Log::info('Travel Insurance Amounts: ' . count($insuranceAmounts));
            foreach ($insuranceAmounts as $amount) {
                AxiomTravelInsuranceAmount::updateOrCreate(
                    ['axiom_id' => $amount['id']],
                    [
                        'name' => $amount['name'],
                    ]
                );
            }

            $customerGroup->travelInsuranceAmounts()->sync(
                AxiomTravelInsuranceAmount::whereIn('axiom_id', array_column($insuranceAmounts, 'id'))->pluck('id')
            );
        }

        $travelInsuranceDestinations = $travelInsuranceClient->getTerritorialCoverage();
        Log::info('Travel Insurance Destinations: ' . count($travelInsuranceDestinations));
        foreach ($travelInsuranceDestinations as $destinationData) {
            AxiomTravelInsuranceDestination::updateOrCreate(
                ['axiom_id' => $destinationData['id']],
                [
                    'name' => $destinationData['name'],
                ]
            );
        }

        $travelTypes = $travelInsuranceClient->getTravelTypes();
        Log::info('Travel Insurance Types: ' . count($travelTypes));
        foreach ($travelTypes as $travelTypeData) {
            $AxiomTravelInsuranceTravelType = AxiomTravelInsuranceTravelType::updateOrCreate(
                ['axiom_id' => $travelTypeData['id']],
                [
                    'name' => $travelTypeData['name'],
                ]
            );

            $travelTypeActivities = $travelInsuranceClient->getTravelTypesActivities(AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID, $travelTypeData['id']);
            Log::info('Travel Type Activities: ' . count($travelTypeActivities));
            foreach ($travelTypeActivities as $activity) {
                AxiomTravelInsuranceTravelTypeActivity::updateOrCreate(
                    [
                        'travel_type_id' => $AxiomTravelInsuranceTravelType->id,
                        'axiom_id' => $activity['id'],
                    ],
                    [
                        'name' => $activity['name'],
                    ]
                );
            }

        }

        $additionalCoverages = $travelInsuranceClient->getAdditionalCoverages()['additionalCoverages'];
        Log::info('Travel Insurance Additional Coverages: ' . count($additionalCoverages));
        foreach ($additionalCoverages as $additionalCoverageData) {
            $additionalCoverage = AxiomTravelInsuranceAdditionalCoverage::updateOrCreate(
                ['axiom_id' => $additionalCoverageData['id']],
                [
                    'name' => $additionalCoverageData['name'],
                ]
            );

            $coverageAmounts = $additionalCoverageData['range'];
            Log::info('Additional Coverage Amounts: ' . count($coverageAmounts));
            foreach ($coverageAmounts as $amount) {
                AxiomTravelInsuranceAdditionalCoverageAmount::updateOrCreate(
                    ['axiom_id' => $amount['id']],
                    [
                        'name' => $amount['name'],
                    ]
                );
            }

            $additionalCoverage->axiomTravelInsuranceAdditionalCoverageAmounts()->sync(
                AxiomTravelInsuranceAdditionalCoverageAmount::whereIn('axiom_id', array_column($coverageAmounts, 'id'))->pluck('id')
            );
        }

        Log::info('Static models data fetched from Axiom');
    }
}
