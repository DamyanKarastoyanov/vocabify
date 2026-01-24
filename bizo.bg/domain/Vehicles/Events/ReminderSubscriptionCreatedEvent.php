<?php

namespace Domain\Vehicles\Events;

use Domain\Vehicles\Models\Vehicle;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Domain\Users\Models\User;


class ReminderSubscriptionCreatedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Vehicle $vehicle,
        public User $user
    ) {
        //
    }
}
