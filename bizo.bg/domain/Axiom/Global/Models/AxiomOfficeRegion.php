<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomOfficeRegion extends Model
{
    use LogsActivity;

    public const DEFAULT_OFFICE_REGION_ID = 15;

    protected $table = 'axiom_office_regions';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'axiom_id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
