<?php

namespace Domain\Vocabulary\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Word extends Model
{
    protected $fillable = [
        'dataset_id',
        'target_language_code',
        'primary_reading',
        'alternative_writing',
        'romanization',
    ];

    public function dataset(): BelongsTo
    {
        return $this->belongsTo(Dataset::class);
    }

    public function glosses(): HasMany
    {
        return $this->hasMany(Gloss::class);
    }

    public function middleGloss(): HasOne
    {
        return $this->hasOne(Gloss::class)->where('role', 'middle');
    }

    public function nativeGloss(): HasOne
    {
        return $this->hasOne(Gloss::class)->where('role', 'native');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function practiceSessionWords(): HasMany
    {
        return $this->hasMany(PracticeSessionWord::class);
    }

    public function practiceSessions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(PracticeSession::class, 'practice_session_words')
            ->withPivot(['order_index', 'result', 'answered_at'])
            ->withTimestamps()
            ->orderByPivot('order_index');
    }
}
