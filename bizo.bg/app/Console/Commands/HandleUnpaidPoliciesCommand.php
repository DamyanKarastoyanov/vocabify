<?php

namespace App\Console\Commands;

use Domain\Insurance\Jobs\HandleUnpaidPoliciesJob;
use Illuminate\Console\Command;

class HandleUnpaidPoliciesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bizo:handle-unpaid-policies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark policies with overdue unpaid installments as pending customer action';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        dispatch(new HandleUnpaidPoliciesJob());
    }
}


