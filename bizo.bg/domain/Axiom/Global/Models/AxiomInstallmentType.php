<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomInstallmentType extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    public const DEFAULT_INSTALLMENT_TYPE_AXIOM_ID = 1;

    protected $table = 'axiom_installment_types';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'axiom_id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
