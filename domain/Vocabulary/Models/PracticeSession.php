<?php

namespace Domain\Vocabulary\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PracticeSession extends Model
{
    protected $fillable = [
        'dataset_id',
        'user_id',
        'mode',
        'total_items',
        'config',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'config' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function dataset(): BelongsTo
    {
        return $this->belongsTo(Dataset::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function practiceSessionItems(): HasMany
    {
        return $this->hasMany(PracticeSessionItem::class)->orderBy('position');
    }

    public function items(): HasMany
    {
        return $this->practiceSessionItems();
    }

    public function words(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Word::class, 'practice_session_items')
            ->withPivot(['position', 'shown_side', 'is_correct', 'response_ms', 'result', 'answered_at'])
            ->withTimestamps()
            ->orderByPivot('position');
    }
}
