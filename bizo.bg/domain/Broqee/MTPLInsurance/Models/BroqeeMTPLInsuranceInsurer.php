<?php

namespace Domain\Broqee\MTPLInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class BroqeeMTPLInsuranceInsurer extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'broqee_mtpl_insurance_insurers';

    protected $fillable = [
        'broqee_id',
        'name',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}


