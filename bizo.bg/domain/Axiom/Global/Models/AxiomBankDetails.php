<?php

namespace Domain\Axiom\Global\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;

class AxiomBankDetails extends Model
{
    protected $table = 'axiom_bank_details';

    protected $fillable = [
        'axiom_id',
        'axiom_bank_id',
        'first_name',
        'last_name',
        'personal_identification_number',
        'personal_identification_number_type_id',
        'district_id',
        'municipality_id',
        'town_id',
        'address',
        'phone',
        'mobile_phone',
        'email',
        'postcode',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    // Relationships can be defined here in the future, e.g.:
    // public function bank()
    // {
    //     return $this->belongsTo(AxiomBank::class, 'axiom_bank_id', 'id');
    // }

    public function personalIdentificationNumberType()
    {
        return $this->belongsTo(AxiomPersonalIdentificationNumberType::class, 'personal_identification_number_type_id', 'id');
    }

    // public function district()
    // {
    //     return $this->belongsTo(AxiomDistrict::class, 'district_id', 'id');
    // }

    // public function municipality()
    // {
    //     return $this->belongsTo(AxiomMunicipality::class, 'municipality_id', 'id');
    // }

    public function town()
    {
        return $this->belongsTo(AxiomTown::class, 'town_id', 'id');
    }
}
