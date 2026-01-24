<?php

namespace Domain\Vehicles\Models;

use App\Support\ActivityLogHelper;
use Domain\Users\Models\User;
use Domain\Vehicles\Models\VehicleSpecification;
use Domain\Vehicles\Models\VehicleInspection;
use Domain\Vehicles\Models\VehicleVignette;
use Domain\Vehicles\Models\VehicleMtplCheck;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Vehicle extends Model
{
    use LogsActivity, SoftDeletes;

    protected $table = 'vehicles';

    protected $fillable = [
        'vin',
        'talon',
        'reg_number',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function specification(): HasOne
    {
        return $this->hasOne(VehicleSpecification::class);
    }

    public function inspection(): HasOne
    {
        return $this->hasOne(VehicleInspection::class)->latestOfMany();
    }

    public function vignettes(): HasMany
    {
        return $this->hasMany(VehicleVignette::class);
    }

    public function mtplChecks(): HasMany
    {
        return $this->hasMany(VehicleMtplCheck::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    public function getTitleAttribute(): string
    {
        $regNumber = $this->reg_number ?? '';
        $mark = $this->specification?->mark ?? '';
        $model = $this->specification?->model ?? '';

        if ($mark && $model) {
            return trim("{$regNumber} - {$mark} {$model}");
        }

        return $regNumber;
    }
}

