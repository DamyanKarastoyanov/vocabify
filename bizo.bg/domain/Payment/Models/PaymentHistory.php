<?php

namespace Domain\Payment\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentHistory extends Model
{
    protected $table = 'payment_history';

    protected $fillable = [
        'user_id',
        'order_number',
        'gateway_order_id',
        'amount',
        'currency',
        'return_url',
        'registration_status_code',
        'registration_error_message',
        'registration_api_response_json',
        'order_status_code',
        'order_error_code',
        'order_error_message',
        'order_api_response_json',
    ];

    protected $casts = [
        'registration_api_response_json' => 'array',
        'order_api_response_json' => 'array',
    ];
}
