<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class MigrateFreshWithSeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:fresh-seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drop all tables and re-run all migrations with seeding';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Running migrate:fresh --seed...');
        
        Artisan::call('migrate:fresh', ['--seed' => true]);
        
        $this->info(Artisan::output());
        
        return Command::SUCCESS;
    }
}
