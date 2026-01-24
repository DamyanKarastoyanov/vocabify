<?php

namespace Domain\Axiom\TravelInsurance\Models;

use App\Support\ActivityLogHelper;
use Domain\Insurance\Models\Policy;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class AxiomTravelInsurancePolicy extends Model implements HasMedia
{
    use LogsActivity, InteractsWithMedia;

    protected $table = 'axiom_travel_insurance_policies';

    protected $fillable = [
        'user_id',
        'axiom_id',
        'total_amount',
        'axiom_offer_id',
        'policy_number',
        'api_response_json',
        'axiom_travel_insurance_destination_id',
        'axiom_travel_insurance_travel_type_id',
        'axiom_travel_insurance_travel_type_activity_id',
        'axiom_currency_id',
        'start_date',
        'end_date',
        'axiom_policy_status_id',
    ];

    public const MEDIA_COLLECTION = 'axiom_travel_insurance_policies';

    public const INSURANCE_TYPE_CODE = 'TRAVEL';

    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->destination->name . ', ' .
            $this->travelType->name .
            ($this->travelTypeActivity ? ', ' . $this->travelTypeActivity->name : '')
        );
    }

    protected function downloadUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('travel-insurance.download-policy', ['policy' => $this->id])
        );
    }

    public static function getTemporaryTitle(AxiomTravelInsuranceDestination $destination, AxiomTravelInsuranceTravelType $travelType, AxiomTravelInsuranceTravelTypeActivity $travelTypeActivity = null): string
    {
        return $destination->name . ', ' .
            $travelType->name .
            ($travelTypeActivity ? ', ' . $travelTypeActivity->name : '');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function policy()
    {
        return $this->morphOne(Policy::class, 'insurable');
    }

    public function destination()
    {
        return $this->belongsTo(AxiomTravelInsuranceDestination::class, 'axiom_travel_insurance_destination_id', 'id');
    }

    public function travelType()
    {
        return $this->belongsTo(AxiomTravelInsuranceTravelType::class, 'axiom_travel_insurance_travel_type_id', 'id');
    }

    public function travelTypeActivity()
    {
        return $this->belongsTo(AxiomTravelInsuranceTravelTypeActivity::class, 'axiom_travel_insurance_travel_type_activity_id', 'id');
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
