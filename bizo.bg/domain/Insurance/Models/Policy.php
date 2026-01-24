<?php

namespace Domain\Insurance\Models;

use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Payment\Models\BankTransfer;
use Domain\Payment\Models\Installment;
use Domain\Payment\Models\PaymentStatus;
use App\Support\ActivityLogHelper;
use Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Policy extends Model
{
    use LogsActivity, SoftDeletes;

    protected $table = 'policies';

    protected $fillable = [
        'user_id',
        'insurable_id',
        'insurance_type_id',
        'insurable_type',
        'policy_number',
        'payment_reference',
        'start_date',
        'end_date',
        'title',
        'axiom_policy_status_id',
        'policy_status_id',
        'insurance_company_id',
        'axiom_currency_id',
        'total_amount',
        'commission',
    ];

    protected function price(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->total_amount . ' ' . ($this->currency ? $this->currency->axiom_id : ''),
        );
    }

    public function insuranceType()
    {
        return $this->belongsTo(InsuranceType::class, 'insurance_type_id', 'id');
    }

    public function reminders()
    {
        return $this->morphMany(Reminder::class, 'remindable');
    }

    public function status()
    {
        return $this->belongsTo(AxiomPolicyStatus::class, 'axiom_policy_status_id', 'id');
    }

    public function internalStatus()
    {
        return $this->belongsTo(PolicyStatus::class, 'policy_status_id', 'id');
    }

    public function insuranceCompany()
    {
        return $this->belongsTo(InsuranceCompany::class, 'insurance_company_id', 'id');
    }

    public function currency()
    {
        return $this->belongsTo(AxiomCurrency::class, 'axiom_currency_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function installments()
    {
        return $this->hasMany(Installment::class);
    }

    public function pendingInstallment(): ?Installment
    {
        return $this->installments()
            ->with('payment')
            ->where(function ($query) {
                $query->whereDoesntHave('payment')
                    ->orWhereHas('payment', function ($q) {
                        $q->where('payment_status_id', PaymentStatus::STATUSES['PENDING']);
                    });
            })
            ->orderBy('sequence')
            ->first();
    }

    public function isDownloadable(): bool
    {
        return $this->policy_status_id === PolicyStatus::STATUSES['ACTIVE'];
    }

    public function insurable()
    {
        return $this->morphTo();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }
}
