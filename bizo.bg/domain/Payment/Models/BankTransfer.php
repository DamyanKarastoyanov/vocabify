<?php

namespace Domain\Payment\Models;

use App\Support\ActivityLogHelper;
use Domain\Insurance\Models\Reminder;
use Domain\Payment\Models\Installment;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class BankTransfer extends Model
{
    use LogsActivity, SoftDeletes;

    protected $fillable = [
        'user_id',
        'reference_number',
        'amount',
        'axiom_currency_id',
        'payment_status_id',
        'verified_at',
        'verified_by',
        'notes',
    ];

    protected function paymentMethod(): Attribute
    {
        return Attribute::make(
            get: fn () => 'Банков превод',
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class, 'payment_status_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function reminders()
    {
        return $this->morphMany(Reminder::class, 'remindable');
    }

    public function installment()
    {
        return $this->morphOne(Installment::class, 'paymentable');
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
