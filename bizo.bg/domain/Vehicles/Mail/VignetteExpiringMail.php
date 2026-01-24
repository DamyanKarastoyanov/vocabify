<?php

namespace Domain\Vehicles\Mail;

use Domain\Vehicles\Models\VehicleVignette;
use Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class VignetteExpiringMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected array $data;

    public function __construct(VehicleVignette $vignette, ?User $user = null)
    {
        $vehicle = $vignette->vehicle;
        $user = $user ?? $vehicle->users()->first();
        $daysUntilExpiry = now()->diffInDays($vignette->valid_to, false);
        
        $this->data = [
            'name' => $user?->profile?->first_name ?? null,
            'reg_number' => $vehicle->reg_number,
            'service_type_name' => 'Проверка на Винетка',
            'valid_to' => $vignette->valid_to,
            'valid_to_formatted' => Carbon::parse($vignette->valid_to)->format('d.m.Y'),
            'days_until_expiry' => max(1, round($daysUntilExpiry)),
            'vehicle_link' => route('vehicles.index'),
        ];

        $this->onQueue('emails');
    }

    public function build()
    {
        $this->data['subject'] = 'Bizo напомняне. Винетката на твоят автомобил изтича скоро!';

        return $this->markdown('emails.vignetteExpiring')
            ->subject($this->data['subject'])
            ->with('data', $this->data);
    }
}

