<?php

namespace Domain\Users\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Profile extends Model
{
    use LogsActivity, HasSelectOptionsTrait, SoftDeletes;

    protected $table = 'profiles';

    protected $fillable = [
        'personal_identification_number_type_id',
        'personal_identification_number',
        'first_name',
        'last_name',
        'birth_date',
        'latin_full_name',
        'address_id',
        'country_id',
        'phone',
        'is_student',
        'driver_experience_years',
        'driver_license',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    protected function isIdentityChangeable(): Attribute
    {
        return Attribute::make(
            get: fn () => !empty($this->personal_identification_number) && !empty($this->personal_identification_number_type_id),
        );
    }


    public function user()
    {
        return $this->hasOne(User::class, 'profile_id');
    }

    public function person()
    {
        return $this->hasOne(Person::class, 'profile_id');
    }

    public function personalIdentificationNumberType()
    {
        return $this->belongsTo(AxiomPersonalIdentificationNumberType::class, 'personal_identification_number_type_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
