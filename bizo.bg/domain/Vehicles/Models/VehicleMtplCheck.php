<?php

namespace Domain\Vehicles\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Domain\Insurance\Models\Reminder;

class VehicleMtplCheck extends Model
{
    use LogsActivity, SoftDeletes;

    protected $table = 'vehicle_mtpl_checks';

    protected $fillable = [
        'vehicle_id',
        'has_valid_insurance',
        'insurer',
        'start_date',
        'end_date',
        'raw_response',
    ];

    protected $casts = [
        'has_valid_insurance' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
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

