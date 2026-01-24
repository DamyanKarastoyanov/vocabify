<?php

namespace App\Console\Broqee\MTPLInsurance\Commands;

use Domain\Broqee\MTPLInsurance\Jobs\FetchMTPLInsuranceStaticModelDataJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class FetchMTPLInsuranceStaticModelDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'broqee:fetch-mtpl-insurance-models';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch Broqee MTPL insurance static models and update the database';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        Log::info('Scheduling FetchMTPLInsuranceStaticModelDataJob job');
        dispatch(new FetchMTPLInsuranceStaticModelDataJob());
        Log::info('FetchMTPLInsuranceStaticModelDataJob job scheduled');
    }
}


