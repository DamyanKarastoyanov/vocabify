<?php

namespace Domain\Vehicles\Mail;

use App\Mail\Concerns\HasUnsubscribeHeaders;
use Domain\Users\Models\User;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class ReminderSubscriptionConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, HasUnsubscribeHeaders;

    protected array $data;

    public function __construct(Vehicle $vehicle, User $user)
    {
        $hasAccount = $user->is_active ?? false;
        
        $this->data = [
            'vehicle_registration' => $vehicle->reg_number ?? '',
            'email' => $user->email ?? '',
            'name' => $user->profile?->first_name ?? '',
            'has_account' => $hasAccount,
            'register_url' => route('register'),
            'vehicles_page_url' => route('vehicles.index'),
            'unsubscribe_url' => URL::signedRoute('opt-in.unsubscribe', [
                'user' => $user->id,
            ]),
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $subject = $this->data['has_account'] 
            ? 'Bizo следи сроковете по всички твои автомобили'
            : 'Твоят абонамент за напомняния от Bizo е активен';

        return $this->markdown('emails.reminderSubscriptionConfirmation')
            ->subject($subject)
            ->to($this->data['email'])
            ->with('data', $this->data)
            ->addUnsubscribeHeaders($this->data['unsubscribe_url']);
    }
}
