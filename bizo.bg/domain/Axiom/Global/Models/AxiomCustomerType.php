<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomCustomerType extends Model
{
    use LogsActivity;

    protected $table = 'axiom_customer_types';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'axiom_id'

    ];

    public CONST INSURER_CUSTOMER_TYPE_ID = 1;
    public CONST MAIN_CUSTOMER_TYPE_ID = 2;
    public CONST THIRD_PARTY_CUSTOMER_TYPE_ID = 3;

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
