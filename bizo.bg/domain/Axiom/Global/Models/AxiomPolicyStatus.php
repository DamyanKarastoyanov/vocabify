<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomPolicyStatus extends Model
{
    use LogsActivity;
    protected $table = 'axiom_policy_statuses';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public const ACTIVE_ID = 1;
    public const INACTIVE_ID = 2;

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
