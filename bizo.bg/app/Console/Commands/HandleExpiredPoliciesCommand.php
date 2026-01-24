<?php

namespace App\Console\Commands;

use Domain\Insurance\Jobs\HandleExpiredPolicesJob;
use Illuminate\Console\Command;

class HandleExpiredPoliciesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bizo:handle-expired-policies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update status fields for expired policies';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        dispatch(new HandleExpiredPolicesJob());
    }
}


