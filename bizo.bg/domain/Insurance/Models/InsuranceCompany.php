<?php

namespace Domain\Insurance\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InsuranceCompany extends Model
{
    use LogsActivity, SoftDeletes;

    protected $table = 'insurance_companies';

    protected $fillable = [
        'name',
    ];

    public const AXIOM_ID = 1;
    public const BROQEE_ID = 2;

    public function policies()
    {
        return $this->hasMany(Policy::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
