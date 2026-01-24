<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomCurrency extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_currencies';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    public function insuranceTypes()
    {
        return $this->belongsToMany(AxiomInsuranceType::class, 'axiom_currency_axiom_insurance_type')
            ->withTimestamps();
    }
}
