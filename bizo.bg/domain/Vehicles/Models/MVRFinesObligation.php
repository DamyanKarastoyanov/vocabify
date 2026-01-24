<?php

namespace Domain\Vehicles\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Domain\Insurance\Models\Reminder;

class MVRFinesObligation extends Model
{
    use LogsActivity, SoftDeletes;

    protected $table = 'mvr_fines_obligations';

    protected $fillable = [
        'mvr_fines_check_id',
        'document_number',
        'document_type',
        'issue_date',
        'is_served',
        'reg_number',
        'violation_date',
        'violation',
        'amount_bgn',
        'discount_bgn',
        'amount_to_pay_bgn',
        'amount_eur',
        'valid_until',
        'obligation_date',
    ];

    protected $casts = [
        'is_served' => 'boolean',
        'issue_date' => 'date',
        'violation_date' => 'date',
        'amount_bgn' => 'decimal:2',
        'discount_bgn' => 'decimal:2',
        'amount_to_pay_bgn' => 'decimal:2',
        'amount_eur' => 'decimal:2',
        'valid_until' => 'date',
        'obligation_date' => 'date',
    ];

    public function mvrFinesCheck(): BelongsTo
    {
        return $this->belongsTo(MVRFinesCheck::class, 'mvr_fines_check_id');
    }

    public function reminders()
    {
        return $this->morphMany(Reminder::class, 'remindable');
    }

    public function user()
    {
        return $this->mvrFinesCheck->user();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}

