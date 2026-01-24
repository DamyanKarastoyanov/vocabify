<?php

namespace Domain\Users\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomTown;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Address extends Model
{
    use LogsActivity, HasSelectOptionsTrait, SoftDeletes;

    protected $table = 'addresses';

    protected $fillable = [
        'district_id',
        'municipality_id',
        'town_id',
        'postal_code',
        'address',
    ];

    public function profiles()
    {
        return $this->hasMany(Profile::class, 'address_id');
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'address_id');
    }

    public function district()
    {
        return $this->belongsTo(AxiomDistrict::class, 'district_id');
    }

    public function municipality()
    {
        return $this->belongsTo(AxiomMunicipality::class, 'municipality_id');
    }

    public function town()
    {
        return $this->belongsTo(AxiomTown::class, 'town_id');
    }

    public function scopeForUser(Builder $query, int $user_id): Builder
    {
        return $query->where(function ($q) use ($user_id) {
            $q->whereHas('profiles.person.user', function ($q2) use ($user_id) {
                $q2->where('id', $user_id);
            })
            ->orWhereHas('profiles.user', function ($q2) use ($user_id) {
                $q2->where('id', $user_id);
            })
            ->orWhereHas('properties.user', function ($q3) use ($user_id) {
                $q3->where('id', $user_id);
            });
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
