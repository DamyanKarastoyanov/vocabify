<?php

namespace Domain\Insurance\Models;

use Illuminate\Database\Eloquent\Model;

class PolicyStatus extends Model
{
    protected $table = 'policy_statuses';

    protected $fillable = [
        'name',
        'code',
    ];

    public const STATUSES = [
        'DRAFT' => 1,
        'PENDING_CUSTOMER_ACTION' => 2,
        'PENDING_INSURER_CONFIRMATION' => 3,
        'AWAITING_PAYMENT_CONFIRMATION' => 4,
        'MANUAL_REVIEW' => 5,
        'ACTIVE' => 6,
        'EXPIRED' => 7,
        'CANCELLED' => 8,
        'DECLINED' => 9,
    ];
}


