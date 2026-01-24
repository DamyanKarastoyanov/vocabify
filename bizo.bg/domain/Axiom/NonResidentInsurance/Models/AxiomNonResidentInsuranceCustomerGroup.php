<?php

namespace Domain\Axiom\NonResidentInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomNonResidentInsuranceCustomerGroup extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_non_resident_insurance_customer_groups';
    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
