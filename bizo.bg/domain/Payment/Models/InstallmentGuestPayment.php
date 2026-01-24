<?php

namespace Domain\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class InstallmentGuestPayment extends Model
{
    protected $table = 'installment_guest_payments';

    protected $fillable = [
        'token',
        'installment_id',
        'expires_at',
        'accessed_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'accessed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->token = $model->token ?? Str::uuid()->toString();
        });
    }

    public function installment()
    {
        return $this->belongsTo(Installment::class);
    }
    public static function resolveByToken(string $token)
    {
        return self::where('token', $token)
            ->with(['installment.policy.insuranceType', 'installment.currency'])
            ->firstOrFail();
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function markAccessed(): void
    {
        $this->update(['accessed_at' => now()]);
    }
}
