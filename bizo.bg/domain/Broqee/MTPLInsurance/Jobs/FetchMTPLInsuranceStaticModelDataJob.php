<?php

namespace Domain\Broqee\MTPLInsurance\Jobs;

use App\Services\External\Broqee\MTPL\BroqeeMTPLInsuranceGateway;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceInsurer;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceLocation;
use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceVehicleUsage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class FetchMTPLInsuranceStaticModelDataJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Log::info('Fetching static models data from Broqee MTPL');

        /** @var BroqeeMTPLInsuranceGateway $gateway */
        $gateway = app(BroqeeMTPLInsuranceGateway::class);

        // Insurers
        $insurers = $gateway->getInsurersNomenclature();
        Log::info('Broqee MTPL Insurers: ' . count($insurers));
        foreach ($insurers as $insurerId) {
            BroqeeMTPLInsuranceInsurer::updateOrCreate(
                ['broqee_id' => $insurerId],
                [
                    // Placeholder name until proper BG names mapping is provided
                    'name' => (string) $insurerId,
                ]
            );
        }

        // Vehicle usages
        $vehicleUsages = $gateway->getVehicleUsagesNomenclature();
        Log::info('Broqee MTPL Vehicle Usages: ' . count($vehicleUsages));
        foreach ($vehicleUsages as $usageId => $usageName) {
            BroqeeMTPLInsuranceVehicleUsage::updateOrCreate(
                ['broqee_id' => (int) $usageId],
                [
                    'name' => (string) $usageName,
                ]
            );
        }

        // Locations
        $locations = $gateway->getLocationsNomenclature();
        Log::info('Broqee MTPL Locations: ' . count($locations));
        foreach ($locations as $location) {
            BroqeeMTPLInsuranceLocation::updateOrCreate(
                ['broqee_id' => (int) ($location['id'] ?? 0)],
                [
                    'region' => (string) ($location['region'] ?? ''),
                    'city' => (string) ($location['city'] ?? ''),
                    'zip' => (string) ($location['zip'] ?? ''),
                ]
            );
        }

        Log::info('Static models data fetched from Broqee MTPL');
    }
}


