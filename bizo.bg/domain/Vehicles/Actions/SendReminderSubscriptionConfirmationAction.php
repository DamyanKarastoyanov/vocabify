<?php

namespace Domain\Vehicles\Actions;

use Domain\Users\Models\User;
use Domain\Vehicles\Mail\ReminderSubscriptionConfirmationMail;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Support\Facades\Mail;

class SendReminderSubscriptionConfirmationAction
{
    public function handle(Vehicle $vehicle, User $user): void
    {
        Mail::to($user?->email)->send(new ReminderSubscriptionConfirmationMail($vehicle, $user));
    }
}
