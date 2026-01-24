<?php

namespace Domain\Insurance\Jobs;

use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class HandleUnpaidPoliciesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Policy::query()
            ->where('axiom_policy_status_id', AxiomPolicyStatus::ACTIVE_ID)
            ->whereHas('installments', function ($query) {
                $query->where('due_date', '<', now())
                    ->where(function ($q) {
                        $q->doesntHave('payment')
                            ->orWhereHasMorph(
                                'payment',
                                [\Domain\Payment\Models\CardPayment::class, \Domain\Payment\Models\BankTransfer::class],
                                function ($p) {
                                    $p->where('payment_status_id', '!=', PaymentStatus::STATUSES['VERIFIED']);
                                }
                            );
                    });
            })
            ->chunkById(500, function ($policies) {
                /** @var Policy $policy */
                foreach ($policies as $policy) {
                    $policy->update([
                        'policy_status_id' => PolicyStatus::STATUSES['PENDING_CUSTOMER_ACTION'],
                    ]);
                }
            });
    }
}


