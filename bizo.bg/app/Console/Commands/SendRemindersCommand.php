<?php

namespace App\Console\Commands;

use Domain\Insurance\Jobs\SendRemindersJob;
use Illuminate\Console\Command;

class SendRemindersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bizo:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send all due reminders (policies, installments, etc.)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        dispatch(new SendRemindersJob());
    }
}
