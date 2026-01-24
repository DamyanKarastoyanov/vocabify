<?php

namespace App\Console\Axiom\NonResidentInsurance\Commands;

use Illuminate\Console\Command;
use Domain\Axiom\NonResidentInsurance\Jobs\FetchNonResidentStaticModelDataJob;
use Illuminate\Support\Facades\Log;

class FetchNonResidentInsuranceModelsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'axiom:fetch-non-resident-insurance-models';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch shared insurance models from Axiom API and update the database';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        Log::info('Schedule FetchNonResidentStaticModelDataJob job');
        dispatch(new FetchNonResidentStaticModelDataJob());
        Log::info('FetchNonResidentStaticModelDataJob job scheduled');
    }
}
