<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\PracticeSessionItem;

class AnswerPracticeWordAction
{
    public function handle(
        PracticeSessionItem $practiceSessionItem,
        string $result,
        ?string $shownSide = null,
        ?int $responseMs = null
    ): PracticeSessionItem {
        $isCorrect = match ($result) {
            'correct' => true,
            'incorrect' => false,
            'skipped' => null,
            default => null,
        };

        $practiceSessionItem->update([
            'result' => $result,
            'is_correct' => $isCorrect,
            'shown_side' => $shownSide,
            'response_ms' => $responseMs,
            'answered_at' => now(),
        ]);

        return $practiceSessionItem->fresh();
    }
}
