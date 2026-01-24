<?php

namespace Domain\Insurance\Models;

use Illuminate\Database\Eloquent\Model;

class InsuranceType extends Model
{
    protected $table = 'insurance_types';

    protected $fillable = [
        'name',
        'code',
        'commission_rate',
    ];

    public const TYPES = [
        'HOME' => 'HOME',
        'TRAVEL' => 'TRAVEL',
        'NON_RESIDENT' => 'NON_RESIDENT',
        'MTPL' => 'MTPL',
    ];
}
