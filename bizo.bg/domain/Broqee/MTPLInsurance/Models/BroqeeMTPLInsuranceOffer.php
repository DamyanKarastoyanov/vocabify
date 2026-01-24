<?php

namespace Domain\Broqee\MTPLInsurance\Models;

use App\Support\ActivityLogHelper;
use Domain\Insurance\Models\Policy;
use Domain\Users\Models\User;
use Domain\Vehicles\Models\Vehicle;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class BroqeeMTPLInsuranceOffer extends Model
{
	use LogsActivity;

	protected $table = 'broqee_mtpl_insurance_offers';

	protected $fillable = [
		'broqee_offer_id',
		'user_id',
        'vehicle_id',
		'order_number',
		'broqee_order_number',
		'api_response_json',
		'api_request_dto_json',
		'status',
		'total',
		'total_bgn',
		'total_eur',
	];

    public const STATUSES = [
        'PENDING' => 1,
        'CONFIRMED' => 2,
        'POLICY_ISSUED' => 3,
        'DECLINED' => 4,
    ];

	protected $casts = [
		'broqee_offer_id' => 'integer',
		'api_response_json' => 'array',
		'api_request_dto_json' => 'array',
		'status' => 'integer',
	];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function payments(): HasMany
	{
		return $this->hasMany(BroqeeMTPLInsuranceOfferPayment::class, 'broqee_mtpl_insurance_offer_id');
	}

	public function getActivitylogOptions(): LogOptions
	{
		return ActivityLogHelper::defaults();
	}

    public function policy()
    {
        return $this->morphOne(Policy::class, 'insurable');
    }
}



