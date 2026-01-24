<?php

namespace Domain\Axiom\NonResidentInsurance\Models;

use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Insurance\Models\Policy;
use App\Support\ActivityLogHelper;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class AxiomNonResidentInsurancePolicy extends Model implements HasMedia
{
    use LogsActivity, InteractsWithMedia;

    protected $table = 'axiom_non_resident_insurance_policies';

    protected $fillable = [
        'user_id',
        'axiom_id',
        'total_amount',
        'axiom_offer_id',
        'policy_number',
        'api_response_json',
        'insured_first_name',
        'insured_last_name',
        'insured_pin',
        'insured_count',
        'axiom_currency_id',
        'start_date',
        'end_date',
        'axiom_policy_status_id',
    ];

    public const MEDIA_COLLECTION = 'axiom_non_resident_insurance_policies';

    public const INSURANCE_TYPE_CODE = 'NONRES';

    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->insured_first_name . ' ' . $this->insured_last_name .
            ($this->insured_count > 1 ? ' (+ още ' . ($this->insured_count - 1) . ' лица)' : '')
        );
    }

    protected function downloadUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('non-resident-insurance.download-policy', ['policy' => $this->id])
        );
    }

    public static function getTemporaryTitle(string $firstName, string $lastName, int $insuredCount): string
    {
        return $firstName . ' ' . $lastName .
            ($insuredCount > 1 ? ' (+ още ' . ($insuredCount - 1) . ' лица)' : '');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function policy()
    {
        return $this->morphOne(Policy::class, 'insurable');
    }

    public function currency()
    {
        return $this->belongsTo(AxiomCurrency::class, 'axiom_currency_id');
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
