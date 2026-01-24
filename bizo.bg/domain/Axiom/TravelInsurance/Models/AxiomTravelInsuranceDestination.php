<?php

namespace Domain\Axiom\TravelInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomTravelInsuranceDestination extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_travel_insurance_destinations';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
