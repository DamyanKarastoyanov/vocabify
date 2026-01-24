<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomBank extends Model
{
    use HasSelectOptionsTrait, LogsActivity;

    protected $table = 'axiom_banks';

    protected $fillable = [
        'name',
        'axiom_id',
    ];

    public CONST CUSTOM_BANK_ID = 1;

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    public function details()
    {
        return $this->hasOne(AxiomBankDetails::class, 'axiom_bank_id', 'id');
    }
}
