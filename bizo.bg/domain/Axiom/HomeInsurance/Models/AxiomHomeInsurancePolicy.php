<?php

namespace Domain\Axiom\HomeInsurance\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Domain\Insurance\Models\Policy;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomTown;
use App\Support\ActivityLogHelper;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class AxiomHomeInsurancePolicy extends Model implements HasMedia
{
    use LogsActivity, InteractsWithMedia;

    protected $table = 'axiom_home_insurance_policies';

    protected $fillable = [
        'user_id',
        'axiom_id',
        'axiom_offer_id',
        'total_amount',
        'axiom_currency_id',
        'start_date',
        'end_date',
        'axiom_policy_status_id',
        'policy_number',
        'api_response_json',
        'axiom_district_id',
        'axiom_municipality_id',
        'axiom_town_id',
        'property_town_type',
        'property_address',
        'property_postal_code',
    ];

    public const MEDIA_COLLECTION = 'axiom_home_insurance_policies';

    public const INSURANCE_TYPE_CODE = 'HOME';

    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->property_address . ', ' .
            ($this->property_town_type ? $this->property_town_type . ' ' : '') .
            $this->town->name . ', общ. ' .
            $this->municipality->name . ', обл. ' .
            $this->district->name
        );
    }

    protected function downloadUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('home-insurance.download-policy', ['policy' => $this->id])
        );
    }

    public static function getTemporaryTitle(string $property_address, string $property_town_type = '', AxiomTown $town, AxiomMunicipality $municipality, AxiomDistrict $district): string
    {
        return $property_address . ', ' .
            ($property_town_type ? $property_town_type . ' ' : '') .
            $town->name . ', общ. ' .
            $municipality->name . ', обл. ' .
            $district->name;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function policy()
    {
        return $this->morphOne(Policy::class, 'insurable');
    }

    public function town()
    {
        return $this->belongsTo(AxiomTown::class, 'axiom_town_id', 'id');
    }

    public function municipality()
    {
        return $this->belongsTo(AxiomMunicipality::class, 'axiom_municipality_id', 'id');
    }

    public function district()
    {
        return $this->belongsTo(AxiomDistrict::class, 'axiom_district_id', 'id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::MEDIA_COLLECTION);
    }
}
