<?php

namespace Domain\Users\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Activation extends Model
{
    use LogsActivity;

    protected $table = 'activations';

    protected $fillable = [
        'user_id',
        'token',
        'expires_at',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
