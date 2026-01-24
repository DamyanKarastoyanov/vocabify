<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomCountry extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_countries';

    protected $fillable = [
        'axiom_id',
        'name',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
