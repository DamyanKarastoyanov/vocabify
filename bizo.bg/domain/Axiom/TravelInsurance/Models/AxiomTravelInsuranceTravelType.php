<?php

namespace Domain\Axiom\TravelInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomTravelInsuranceTravelType extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_travel_insurance_travel_types';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public function travelInsuranceTravelTypeActivities()
    {
        return $this->hasMany(AxiomTravelInsuranceTravelTypeActivity::class, 'travel_type_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
