<?php

namespace Domain\Axiom\TravelInsurance\Models;

use App\Traits\Model\HasSelectOptionsTrait;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Insurance\Models\Policy;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Support\ActivityLogHelper;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomTravelInsuranceOffer extends Model
{
    use LogsActivity, HasSelectOptionsTrait, SoftDeletes;

    protected $table = 'axiom_travel_insurance_offers';
    protected $fillable = [
        'axiom_id',
        'user_id',
        'order_number',
        'amount',
        'axiom_currency_id',
        'api_response_json',
        'status',
    ];

    public const STATUS = [
        'PENDING' => 0,
        'COMPLETED' => 1,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function axiomTravelInsurancePolicy()
    {
        return $this->hasOne(AxiomTravelInsurancePolicy::class, 'axiom_offer_id');
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
}
