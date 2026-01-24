<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomOffice extends Model
{
    use LogsActivity;

    public const DEFAULT_OFFICE_ID = 11114;

    protected $table = 'axiom_offices';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'axiom_office_region_id',
        'axiom_id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
