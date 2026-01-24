<?php

namespace Domain\Vehicles\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Domain\Insurance\Models\Reminder;

class VehicleInspection extends Model
{
    use LogsActivity;

    protected $table = 'vehicle_inspections';

    protected $fillable = [
        'vehicle_id',
        'next_inspection_date',
        'is_valid',
        'is_periodic',
        'raw_response',
    ];

    protected $casts = [
        'next_inspection_date' => 'date',
        'is_valid' => 'boolean',
        'is_periodic' => 'boolean',
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

