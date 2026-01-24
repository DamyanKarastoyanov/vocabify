<?php

namespace Domain\Axiom\TravelInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomTravelInsuranceAdditionalCoverage extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_travel_insurance_additional_coverages';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public function axiomTravelInsuranceAdditionalCoverageAmounts()
    {
        return $this->belongsToMany(AxiomTravelInsuranceAdditionalCoverageAmount::class, 'axiom_travel_additional_coverage_additional_coverage_amount')
            ->withTimestamps();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
