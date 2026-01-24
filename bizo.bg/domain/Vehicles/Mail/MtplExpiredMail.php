<?php

namespace Domain\Vehicles\Mail;

use Domain\Vehicles\Models\VehicleMtplCheck;
use Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class MtplExpiredMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(VehicleMtplCheck $mtplCheck, ?User $user = null)
    {
        $vehicle = $mtplCheck->vehicle;
        $user = $user ?? $vehicle->users()->first();
        
        $this->data = [
            'name' => $user?->profile?->first_name ?? null,
            'reg_number' => $vehicle->reg_number,
            'service_type_name' => 'Проверка на ГО',
            'expired_date' => $mtplCheck->end_date,
            'expired_date_formatted' => Carbon::parse($mtplCheck->end_date)->format('d.m.Y'),
            'insurer' => $mtplCheck->insurer,
            'vehicle_link' => route('vehicles.index'),
            'mtpl_offers_link' => route('welcome'), // TODO: Update to MTPL offers page
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo аларма! ГО на твоя автомобил е изтекла!';

        return $this->markdown('emails.mtplExpired')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}

