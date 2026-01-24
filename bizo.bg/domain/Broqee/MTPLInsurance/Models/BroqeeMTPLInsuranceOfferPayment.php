<?php

namespace Domain\Broqee\MTPLInsurance\Models;

use App\Support\ActivityLogHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class BroqeeMTPLInsuranceOfferPayment extends Model
{
	use LogsActivity;

	protected $table = 'broqee_mtpl_insurance_offer_payments';

	protected $fillable = [
		'broqee_mtpl_insurance_offer_id',
		'number',
		'total',
		'total_bgn',
		'total_eur',
	];

	public function offer(): BelongsTo
	{
		return $this->belongsTo(BroqeeMTPLInsuranceOffer::class, 'broqee_mtpl_insurance_offer_id');
	}

	public function getActivitylogOptions(): LogOptions
	{
		return ActivityLogHelper::defaults();
	}
}



