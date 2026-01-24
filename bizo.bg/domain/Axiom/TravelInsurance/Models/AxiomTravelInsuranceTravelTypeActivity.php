<?php

namespace Domain\Axiom\TravelInsurance\Models;

use App\Support\ActivityLogHelper;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomTravelInsuranceTravelTypeActivity extends Model
{
    use LogsActivity;

    protected $table = 'axiom_travel_insurance_travel_type_activities';

    protected $fillable = [
        'name',
        'axiom_id',
        'travel_type_id',
    ];

    public function travelInsuranceTravelType()
    {
        return $this->belongsTo(AxiomTravelInsuranceTravelType::class, 'travel_type_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
