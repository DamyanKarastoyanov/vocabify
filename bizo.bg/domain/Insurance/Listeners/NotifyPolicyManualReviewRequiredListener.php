<?php

namespace Domain\Insurance\Listeners;

use Domain\Insurance\Actions\NotifyPolicyManualReviewRequiredAction;
use Domain\Insurance\Events\PolicyManualReviewRequiredEvent;

class NotifyPolicyManualReviewRequiredListener
{
    public function __construct(protected NotifyPolicyManualReviewRequiredAction $notifyPolicyManualReviewRequiredAction)
    {
        //
    }

    public function handle(PolicyManualReviewRequiredEvent $event): void
    {
        $this->notifyPolicyManualReviewRequiredAction->handle($event->policy);
    }
}


