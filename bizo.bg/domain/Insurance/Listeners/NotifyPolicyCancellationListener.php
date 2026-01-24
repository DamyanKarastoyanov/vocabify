<?php

namespace Domain\Insurance\Listeners;

use Domain\Insurance\Actions\NotifyPolicyCancellationAction;
use Domain\Insurance\Events\PolicyCancellationEvent;

class NotifyPolicyCancellationListener
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected NotifyPolicyCancellationAction $notifyPolicyCancellationAction
    ) {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PolicyCancellationEvent $event): void
    {
        $policy = $event->policy;

        $this->notifyPolicyCancellationAction->handle($policy);
    }
}
