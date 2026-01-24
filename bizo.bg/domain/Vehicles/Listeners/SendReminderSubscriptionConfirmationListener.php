<?php

namespace Domain\Vehicles\Listeners;

use Domain\Vehicles\Actions\SendReminderSubscriptionConfirmationAction;
use Domain\Vehicles\Events\ReminderSubscriptionCreatedEvent;

class SendReminderSubscriptionConfirmationListener
{
    public function __construct(
        protected SendReminderSubscriptionConfirmationAction $sendReminderSubscriptionConfirmationAction
    ) {
        //
    }

    public function handle(ReminderSubscriptionCreatedEvent $event): void
    {
        $this->sendReminderSubscriptionConfirmationAction->handle(
            $event->vehicle,
            $event->user
        );
    }
}
