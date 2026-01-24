<?php

namespace Domain\Broqee\MTPLInsurance\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class BroqeeMTPLInsuranceLocation extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'broqee_mtpl_insurance_locations';

    protected $fillable = [
        'broqee_id',
        'region',
        'city',
        'zip',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}


