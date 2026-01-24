<?php

namespace Domain\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class DebitNote extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'debit_notes';

    protected $fillable = [
        'installment_id',
    ];

    public const MEDIA_COLLECTION = 'debit_notes';

    public function installment()
    {
        return $this->belongsTo(Installment::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::MEDIA_COLLECTION);
    }
}
