<?php

namespace Domain\Payment\Models;

use App\Support\ActivityLogHelper;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Models\Reminder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Installment extends Model
{
    use LogsActivity, SoftDeletes;

    protected $table = 'installments';

    protected $fillable = [
        'policy_id',
        'order_number',
        'sequence',
        'amount_due',
        'axiom_currency_id',
        'due_date',
        'paymentable_id',
        'paymentable_type',
    ];

    protected function price(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->amount_due . ' ' . ($this->currency ? $this->currency->axiom_id : ''),
        );
    }

    protected function user(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->policy ? $this->policy->user : null,
        );
    }

    public function debitNote()
    {
        return $this->hasOne(DebitNote::class);
    }

    public function guestPayment()
    {
        return $this->hasOne(InstallmentGuestPayment::class);
    }

    public function reminders()
    {
        return $this->morphMany(Reminder::class, 'remindable');
    }

    public function currency()
    {
        return $this->belongsTo(AxiomCurrency::class, 'axiom_currency_id');
    }

    public function payment()
    {
        return $this->morphTo('paymentable');
    }

    public function policy()
    {
        return $this->belongsTo(Policy::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
