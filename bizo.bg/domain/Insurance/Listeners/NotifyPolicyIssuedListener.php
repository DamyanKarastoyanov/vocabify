<?php

namespace Domain\Insurance\Listeners;

use Domain\Insurance\Actions\NotifyPolicyActivationSuccessAction;
use Domain\Insurance\Events\PolicyIssuedEvent;
use Domain\Users\Actions\NotifyAccountActivationAction;

class NotifyPolicyIssuedListener
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected NotifyPolicyActivationSuccessAction $notifyPolicyActivationSuccessAction,
        protected NotifyAccountActivationAction $notifyAccountActivationAction
    ) {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PolicyIssuedEvent $event): void
    {
        $policy = $event->policy;

        $this->notifyPolicyActivationSuccessAction->handle($policy);
        $this->notifyAccountActivationAction->handle($policy->user, true);
    }
}
