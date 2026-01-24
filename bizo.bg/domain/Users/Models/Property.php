<?php

namespace Domain\Users\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Property extends Model
{
    use LogsActivity, HasSelectOptionsTrait, SoftDeletes;

    protected $table = 'properties';

    protected $fillable = [
        'gross_floor_area_m2',
        'address_id',
        'user_id',
    ];

    public function address()
    {
        return $this->belongsTo(Address::class);
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
