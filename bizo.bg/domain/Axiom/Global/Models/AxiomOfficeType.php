<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomOfficeType extends Model
{
    use LogsActivity;

    protected $table = 'axiom_office_types';
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
