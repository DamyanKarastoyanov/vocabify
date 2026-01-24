<?php

namespace App\Console\Users\Commands;

use Illuminate\Console\Command;
use Domain\Users\Jobs\CleanStaleAccountActivationsJob;
use Illuminate\Support\Facades\Log;

class CleanStaleAccountActivationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bizo:clean-stale-account-activations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up stale account activations';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        Log::info('Schedule CleanStaleAccountActivationsJob job');
        dispatch(new CleanStaleAccountActivationsJob());
        Log::info('CleanStaleAccountActivationsJob job scheduled');
    }
}
