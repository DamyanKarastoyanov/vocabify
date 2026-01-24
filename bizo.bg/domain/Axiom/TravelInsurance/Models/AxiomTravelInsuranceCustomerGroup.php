<?php

namespace Domain\Axiom\TravelInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomTravelInsuranceCustomerGroup extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_travel_insurance_customer_groups';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public function travelInsuranceAmounts()
    {
        return $this->belongsToMany(AxiomTravelInsuranceAmount::class, 'axiom_travel_customer_group_axiom_travel_amount')
            ->withTimestamps();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
