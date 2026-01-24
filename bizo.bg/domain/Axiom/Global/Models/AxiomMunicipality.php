<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomMunicipality extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_municipalities';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'axiom_district_id',
        'axiom_id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
