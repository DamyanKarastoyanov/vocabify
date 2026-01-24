<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Domain\Axiom\Global\Jobs\FetchStaticModelsDataFromAxiom;
use Illuminate\Support\Facades\Log;
class FetchHomeInsuranceModelsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'axiom:fetch-global-models';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch shared insurance models from Axiom API and update the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('Schedule FetchStaticModelsDataFromAxiom job');
        dispatch(new FetchStaticModelsDataFromAxiom());
        Log::info('FetchStaticModelsDataFromAxiom job scheduled');
    }
}
