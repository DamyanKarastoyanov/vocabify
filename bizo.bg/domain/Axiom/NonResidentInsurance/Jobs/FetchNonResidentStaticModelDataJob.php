<?php

namespace Domain\Axiom\NonResidentInsurance\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\External\Axiom\AxiomApiClientService;
use App\Services\External\Axiom\NonResident\AxiomNonResidentsInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceCustomerGroup;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePeriod;
use Illuminate\Support\Facades\Log;

class FetchNonResidentStaticModelDataJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Log::info('Fetching static models data from Axiom');
        $client = app(AxiomApiClientService::class);
        $nonResidentInsuranceGateway = app(AxiomNonResidentsInsuranceGateway::class);

        $periods = $nonResidentInsuranceGateway->getPeriods();
        Log::info('Periods: ' . count($periods));
        foreach ($periods as $period) {
            AxiomNonResidentInsurancePeriod::updateOrCreate(
                ['axiom_id' => $period['id']],
                [
                    'name' => $period['name'],
                ]
            );
        }

        $insuranceType = AxiomInsuranceType::updateOrCreate(
            ['axiom_id' => AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID],
            [
                'name' => 'AXI NON-RESIDENT',
            ]
        );

        $currencies = $client->getCurrencies(AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID);
        Log::info('Currencies NON_RESIDENT: ' . count($currencies));
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

        $nonResidentInsuranceCustomerGroups = $nonResidentInsuranceGateway->getCustomerGroups();
        Log::info('Non-Resident Insurance Customer Groups: ' . count($nonResidentInsuranceCustomerGroups));
        foreach ($nonResidentInsuranceCustomerGroups as $customerGroupData) {
            $customerGroup = AxiomNonResidentInsuranceCustomerGroup::updateOrCreate(
                ['axiom_id' => $customerGroupData['id']],
                [
                    'name' => $customerGroupData['name'],
                ]
            );
        }

        Log::info('Static models data fetched from Axiom');
    }
}
