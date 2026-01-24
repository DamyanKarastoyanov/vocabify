<?php

namespace Domain\Vocabulary\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dataset extends Model
{
    protected $fillable = [
        'name',
        'target_language_code',
        'user_id',
    ];

    public function words(): HasMany
    {
        return $this->hasMany(Word::class);
    }

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class);
    }
}
