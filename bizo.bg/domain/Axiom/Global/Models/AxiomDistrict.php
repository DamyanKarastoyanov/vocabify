<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomDistrict extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_districts';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'axiom_country_id',
        'axiom_id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
