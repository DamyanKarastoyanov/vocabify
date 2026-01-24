<?php

namespace App\Console;

use App;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Artisan;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        \App\Console\Commands\FetchHomeInsuranceModelsCommand::class,
        \App\Console\Commands\SendRemindersCommand::class,
        \App\Console\Axiom\NonResidentInsurance\Commands\FetchNonResidentInsuranceModelsCommand::class,
        \App\Console\Users\Commands\CleanStaleAccountActivationsCommand::class,
        \App\Console\Broqee\MTPLInsurance\Commands\FetchMTPLInsuranceStaticModelDataCommand::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        $schedule->command('backup:run --only-db')
            ->dailyAt('23:30')
            ->before(function () {

            })
            ->after(function () {
                Artisan::call('backup:clean');
            })
        ;

        $schedule->command('axiom:fetch-global-models')->daily();
        $schedule->command('axiom:fetch-non-resident-insurance-models')->daily();

        $schedule->command('bizo:send-reminders')->daily()->at('01:00');

        $schedule->command('bizo:handle-expired-policies')->daily()->at('02:00');

        $schedule->command('bizo:handle-unpaid-policies')->daily()->at('02:10');

        $schedule->command('bizo:clean-stale-account-activations')->hourly();

        $schedule->command('broqee:fetch-mtpl-insurance-models')->everyTwoHours();
    }

    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}

