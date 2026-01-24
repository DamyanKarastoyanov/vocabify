<?php

namespace Domain\Broqee\MTPLInsurance\Models;

use App\Support\ActivityLogHelper;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Insurance\Models\Policy;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class BroqeeMTPLInsurancePolicy extends Model implements HasMedia
{
	use LogsActivity, InteractsWithMedia;

	protected $table = 'broqee_mtpl_insurance_policies';

	protected $fillable = [
		'user_id',
		'total_amount',
		'axiom_currency_id',
		'policy_number',
		'insurer_keyword',
		'broqee_mtpl_insurance_offer_id',
		'api_response_json',
		'start_date',
		'end_date',
		'axiom_policy_status_id',
	];

	public const MEDIA_COLLECTION = 'broqee_mtpl_insurance_policies';

	public const INSURANCE_TYPE_CODE = 'MTPL';

	protected $casts = [
		'api_response_json' => 'array',
		'start_date' => 'date',
		'end_date' => 'date',
		'total_amount' => 'decimal:2',
	];

    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->policy_number .
            ($this->offer?->vehicle ? ' - ' . $this->offer->vehicle->title : '')
        );
    }

    protected function downloadUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('mtpl-insurance.download-policy', ['policy' => $this->id])
        );
    }

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function offer(): BelongsTo
	{
		return $this->belongsTo(BroqeeMTPLInsuranceOffer::class, 'broqee_mtpl_insurance_offer_id');
	}

    public function policy()
    {
        return $this->morphOne(Policy::class, 'insurable');
    }

	public function currency(): BelongsTo
	{
		return $this->belongsTo(AxiomCurrency::class, 'axiom_currency_id');
	}

	public function status(): BelongsTo
	{
		return $this->belongsTo(AxiomPolicyStatus::class, 'axiom_policy_status_id');
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


