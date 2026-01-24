<?php

namespace App\Http\Web\Datasets\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WordsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->transformWord($this->resource);
    }

    private function transformWord($word): array
    {
        $nativeGloss = $word->nativeGloss;
        $middleGloss = $word->middleGloss;

        // Get all tags for this word
        $tags = $word->tags->map(fn($tag) => $tag->name)->toArray();

        // TODO: Calculate strength from SessionItem data when available
        $strength = 0;

        // TODO: Get last practiced date from SessionItem when available
        $lastPracticed = null;

        return [
            'id' => $word->id,
            'primary_reading' => $word->primary_reading,
            'alternative_writing' => $word->alternative_writing,
            'romanization' => $word->romanization,
            'native_meaning' => $nativeGloss?->meaning_text,
            'native_meaning_alt' => null, // Could be additional native glosses
            'middle_language' => $middleGloss?->meaning_text,
            'tags' => $tags,
            'strength' => $strength,
            'last_practiced' => $lastPracticed?->diffForHumans(),
        ];
    }
}
