<?php

namespace Domain\Vehicles\Mail;

use Domain\Vehicles\Models\VehicleVignette;
use Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class VignetteExpiredMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(VehicleVignette $vignette, ?User $user = null)
    {
        $vehicle = $vignette->vehicle;
        $user = $user ?? $vehicle->users()->first();
        
        $this->data = [
            'name' => $user?->profile?->first_name ?? null,
            'reg_number' => $vehicle->reg_number,
            'service_type_name' => 'Проверка на Винетка',
            'expired_date' => $vignette->valid_to,
            'expired_date_formatted' => Carbon::parse($vignette->valid_to)->format('d.m.Y'),
            'vehicle_link' => route('vehicles.index'),
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo аларма! Винетката на твоя автомобил е изтекла!';

        return $this->markdown('emails.vignetteExpired')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}

