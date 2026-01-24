<?php

namespace Domain\Vehicles\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Domain\Insurance\Models\Reminder;
use Domain\Users\Models\User;

class MVRFinesCheck extends Model
{
    use LogsActivity, SoftDeletes;

    protected $table = 'mvr_fines_checks';

    protected $fillable = [
        'egn',
        'driving_licence_number',
        'has_obligations',
        'total_amount_bgn',
        'total_amount_eur',
        'raw_response',
    ];

    protected $casts = [
        'has_obligations' => 'boolean',
        'total_amount_bgn' => 'decimal:2',
        'total_amount_eur' => 'decimal:2',
        'raw_response' => 'array',
    ];

    public function obligations(): HasMany
    {
        return $this->hasMany(MVRFinesObligation::class, 'mvr_fines_check_id');
    }

    public function user()
    {
        return User::whereHas('profile', function($query) {
            $query->where('personal_identification_number', $this->egn);
        })->first();
    }

    public function reminders()
    {
        return $this->morphMany(Reminder::class, 'remindable');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}

