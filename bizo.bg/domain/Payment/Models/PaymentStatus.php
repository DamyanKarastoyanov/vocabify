<?php

namespace Domain\Payment\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PaymentStatus extends Model
{
    use LogsActivity;

    protected $table = 'payment_statuses';

    protected $fillable = [
        'name',
    ];

    public const STATUSES = [
        'PENDING' => 1,
        'VERIFIED' => 2,
        'REJECTED' => 3,
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
