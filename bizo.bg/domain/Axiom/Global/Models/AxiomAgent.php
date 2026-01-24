<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomAgent extends Model
{
    use LogsActivity;

    public const DEFAULT_AGENT_ID = 22;

    protected $table = 'axiom_agents';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'external_code',
        'axiom_agent_type_id',
        'axiom_id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
