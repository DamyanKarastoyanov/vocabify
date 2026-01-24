<?php

namespace Domain\Axiom\HomeInsurance\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomHomeInsuranceProperty extends Model
{
    use LogsActivity;

    protected $table = 'axiom_home_insurance_properties';

    protected $fillable = [
        'user_id',
        'axiom_town_id',
        'address',
        'size',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
