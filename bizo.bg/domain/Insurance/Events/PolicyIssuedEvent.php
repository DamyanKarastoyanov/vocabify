<?php

namespace Domain\Insurance\Events;

use Domain\Insurance\Models\Policy;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PolicyIssuedEvent
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Policy $policy)
    {
        //
    }
}
