<?php

namespace App\Models;

namespace Domain\Users\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Person extends Model
{
    use LogsActivity, HasSelectOptionsTrait, SoftDeletes;

    protected $table = 'persons';

    protected $fillable = [
        'profile_id',
        'user_id',
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
