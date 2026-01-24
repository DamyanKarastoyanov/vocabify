<?php

namespace Domain\Vehicles\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class VehicleSpecification extends Model
{
    use LogsActivity;

    protected $table = 'vehicle_specifications';

    protected $fillable = [
        'vehicle_id',
        'mark',
        'model',
        'engine_volume',
        'engine_power',
        'manufactured_year',
        'euro_standard',
        'wheel_direction',
    ];

    const WHEEL_DIRECTIONS = [
        'LEFT' => 'left',
        'RIGHT' => 'right',
    ];

    protected $casts = [
        'manufactured_year' => 'integer',
        'wheel_direction' => 'string',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    /**
     * Get all wheel direction values
     */
    public static function getWheelDirectionValues(): array
    {
        return array_values(self::WHEEL_DIRECTIONS);
    }

    /**
     * Get wheel direction label
     */
    public function getWheelDirectionLabelAttribute(): string
    {
        return ucfirst($this->wheel_direction);
    }
}

