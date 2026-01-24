<?php

namespace Domain\Vehicles\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Domain\Insurance\Models\Reminder;

class VehicleVignette extends Model
{
    use LogsActivity;

    protected $table = 'vehicle_vignettes';

    protected $fillable = [
        'vehicle_id',
        'country',
        'valid_from',
        'valid_to',
        'vignette_number',
        'raw_response',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_to' => 'date',
        'raw_response' => 'array',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function reminders()
    {
        return $this->morphMany(Reminder::class, 'remindable');
    }

    public function user()
    {
        return $this->vehicle->users()->first();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}

