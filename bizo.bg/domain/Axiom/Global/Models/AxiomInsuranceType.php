<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomInsuranceType extends Model
{
    use LogsActivity;
    protected $table = 'axiom_insurance_types';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public const HOME_INSURANCE_TYPE_AXIOM_ID = 805;
    public const TRAVEL_INSURANCE_TYPE_AXIOM_ID = 209;
    public const NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID = 202;

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    public function currencies()
    {
        return $this->belongsToMany(AxiomCurrency::class, 'axiom_currency_axiom_insurance_type')
            ->withTimestamps();
    }
}
