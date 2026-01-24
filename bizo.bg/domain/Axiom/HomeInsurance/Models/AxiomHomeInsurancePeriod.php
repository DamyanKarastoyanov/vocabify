<?php

namespace Domain\Axiom\HomeInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomHomeInsurancePeriod extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_home_insurance_periods';
    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
