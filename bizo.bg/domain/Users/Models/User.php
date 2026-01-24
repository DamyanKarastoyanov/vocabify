<?php

namespace Domain\Users\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;
use Domain\Vehicles\Models\Vehicle;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, LogsActivity, HasRoles;

    public const SYSTEM_USER_ID = 1;
    public const DEFAULT_PIN = '0000000000';
    public const DEFAULT_EMAIL = 'no-reply@bizo.bg';
    public const DEFAULT_PASSWORD = 'd6tBbY8JKRHBo41tQBuC';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'profile_id',
        'is_active',
        'email',
        'password',
        'opt_in',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->profile ? ($this->profile->first_name . ' ' . $this->profile->last_name) : '',
        );
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function persons()
    {
        return $this->hasMany(Person::class);
    }

    public function vehicles()
    {
        return $this->belongsToMany(Vehicle::class)->withTimestamps();
    }

    /**
     * Get the user activity log options.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
