<?php

namespace Domain\Payment\Models;

use App\Support\ActivityLogHelper;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class CardPayment extends Model
{
    use LogsActivity, SoftDeletes;

    protected $fillable = [
        'user_id',
        'reference_number',
        'amount',
        'axiom_currency_id',
        'payment_status_id',
        'notes',
    ];

    protected function paymentMethod(): Attribute
    {
        return Attribute::make(
            get: fn () => 'Плащане с карта',
        );
    }

    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class, 'payment_status_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isVerified(): bool
    {
        return $this->payment_status_id === PaymentStatus::STATUSES['VERIFIED'];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
