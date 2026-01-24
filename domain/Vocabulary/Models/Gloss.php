<?php

namespace Domain\Vocabulary\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gloss extends Model
{
    public const ROLE_MIDDLE = 'middle';
    public const ROLE_NATIVE = 'native';
    public const ROLE_OTHER = 'other';

    protected $fillable = [
        'word_id',
        'language_code',
        'meaning_text',
        'role',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }
}
