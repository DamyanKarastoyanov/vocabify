<?php

namespace Domain\Insurance\Events;

use Domain\Insurance\Models\Policy;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PolicyManualReviewRequiredEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(public Policy $policy)
    {
        //
    }
}


