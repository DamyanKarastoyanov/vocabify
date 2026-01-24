<?php

namespace Domain\Users\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Domain\Users\Models\Activation;
use Illuminate\Support\Facades\Log;

class CleanStaleAccountActivationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Log::info('Cleaning up stale account activations');

        Activation::where('expires_at', '<', now())->delete();

        Log::info('Stale account activations cleaned up');
    }
}
