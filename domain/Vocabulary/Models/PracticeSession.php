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
        'items_count',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
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

    public function practiceSessionWords(): HasMany
    {
        return $this->hasMany(PracticeSessionWord::class)->orderBy('order_index');
    }

    public function words(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Word::class, 'practice_session_words')
            ->withPivot(['order_index', 'result', 'answered_at'])
            ->withTimestamps()
            ->orderByPivot('order_index');
    }
}
