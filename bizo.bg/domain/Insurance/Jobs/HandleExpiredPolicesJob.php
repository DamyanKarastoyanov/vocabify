<?php

namespace Domain\Insurance\Jobs;

use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Models\PolicyStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class HandleExpiredPolicesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Policy::query()
            ->where('end_date', '<', now())
            ->where('axiom_policy_status_id', AxiomPolicyStatus::ACTIVE_ID)
            ->chunkById(500, function ($policies) {
                /** @var Policy $policy */
                foreach ($policies as $policy) {
                    $policy->update([
                        'axiom_policy_status_id' => AxiomPolicyStatus::INACTIVE_ID,
                        'policy_status_id' => PolicyStatus::STATUSES['EXPIRED'],
                    ]);
                }
            });
    }
}


