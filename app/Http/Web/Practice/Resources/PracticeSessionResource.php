<?php

namespace App\Http\Web\Practice\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticeSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'dataset_id' => $this->dataset_id,
            'user_id' => $this->user_id,
            'items_count' => $this->items_count,
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'words' => $this->whenLoaded('practiceSessionWords', function () {
                return $this->practiceSessionWords->map(function ($practiceSessionWord) {
                    return [
                        'practice_session_word_id' => $practiceSessionWord->id,
                        'order_index' => $practiceSessionWord->order_index,
                        'word' => [
                            'id' => $practiceSessionWord->word->id,
                            'primary_reading' => $practiceSessionWord->word->primary_reading,
                            'alternative_writing' => $practiceSessionWord->word->alternative_writing,
                            'romanization' => $practiceSessionWord->word->romanization,
                            'target_language_code' => $practiceSessionWord->word->target_language_code,
                            'glosses' => $practiceSessionWord->word->glosses->map(function ($gloss) {
                                return [
                                    'id' => $gloss->id,
                                    'language_code' => $gloss->language_code,
                                    'meaning_text' => $gloss->meaning_text,
                                    'role' => $gloss->role,
                                    'is_primary' => $gloss->is_primary,
                                ];
                            }),
                        ],
                    ];
                });
            }),
        ];
    }
}
