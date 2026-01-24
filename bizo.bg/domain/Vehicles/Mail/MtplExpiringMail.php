<?php

namespace Domain\Vehicles\Mail;

use Domain\Vehicles\Models\VehicleMtplCheck;
use Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class MtplExpiringMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(VehicleMtplCheck $mtplCheck, ?User $user = null)
    {
        $vehicle = $mtplCheck->vehicle;
        $user = $user ?? $vehicle->users()->first();
        $daysUntilExpiry = now()->diffInDays($mtplCheck->end_date, false);
        
        $this->data = [
            'name' => $user?->profile?->first_name ?? null,
            'reg_number' => $vehicle->reg_number,
            'end_date' => $mtplCheck->end_date,
            'service_type_name' => 'Проверка на ГО',
            'end_date_formatted' => Carbon::parse($mtplCheck->end_date)->format('d.m.Y'),
            'days_until_expiry' => max(1, round($daysUntilExpiry)),
            'insurer' => $mtplCheck->insurer,
            'vehicle_link' => route('vehicles.index'),
            'mtpl_offers_link' => route('welcome'), // TODO: Update to MTPL offers page
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo напомняне. ГО на твоят автомобил изтича скоро!';

        return $this->markdown('emails.mtplExpiring')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}

