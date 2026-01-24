<?php

namespace Domain\Vocabulary\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'dataset_id',
        'name',
        'slug',
        'description',
        'color',
    ];

    public function dataset(): BelongsTo
    {
        return $this->belongsTo(Dataset::class);
    }

    public function words(): BelongsToMany
    {
        return $this->belongsToMany(Word::class);
    }
}
