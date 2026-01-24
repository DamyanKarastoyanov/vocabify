<?php

namespace Domain\Insurance\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $table = 'reminders';

    protected $fillable = [
        'remindable_type',
        'remindable_id',
        'type',
        'sent_at',
    ];

    public function remindable()
    {
        return $this->morphTo();
    }
}
