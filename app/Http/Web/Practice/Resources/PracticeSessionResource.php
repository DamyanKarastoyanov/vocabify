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
            'mode' => $this->mode,
            'total_items' => $this->total_items,
            'config' => $this->config,
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'words' => $this->whenLoaded('practiceSessionItems', function () {
                return $this->practiceSessionItems->map(function ($item) {
                    return [
                        'practice_session_item_id' => $item->id,
                        'position' => $item->position,
                        'shown_side' => $item->shown_side,
                        'is_correct' => $item->is_correct,
                        'response_ms' => $item->response_ms,
                        'word' => [
                            'id' => $item->word->id,
                            'primary_reading' => $item->word->primary_reading,
                            'alternative_writing' => $item->word->alternative_writing,
                            'romanization' => $item->word->romanization,
                            'target_language_code' => $item->word->target_language_code,
                            'glosses' => $item->word->glosses->map(function ($gloss) {
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
