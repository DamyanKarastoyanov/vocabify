<?php

namespace Domain\Vehicles\Mail;

use Domain\Vehicles\Models\VehicleInspection;
use Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class VehicleInspectionExpiredMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(VehicleInspection $inspection, ?User $user = null)
    {
        $vehicle = $inspection->vehicle;
        $user = $user ?? $vehicle->users()->first();
        
        $this->data = [
            'name' => $user?->profile?->first_name ?? null,
            'reg_number' => $vehicle->reg_number,
            'service_type_name' => 'Годишен технически преглед',
            'expired_date' => $inspection->next_inspection_date,
            'expired_date_formatted' => Carbon::parse($inspection->next_inspection_date)->format('d.m.Y'),
            'vehicle_link' => route('vehicles.index'),
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo аларма! ГТП на твоя автомобил е изтекъл!';

        return $this->markdown('emails.vehicleInspectionExpired')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}

