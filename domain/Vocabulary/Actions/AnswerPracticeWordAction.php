<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\PracticeSessionWord;

class AnswerPracticeWordAction
{
    public function handle(
        PracticeSessionWord $practiceSessionWord,
        string $result
    ): PracticeSessionWord {
        $practiceSessionWord->update([
            'result' => $result,
            'answered_at' => now(),
        ]);

        return $practiceSessionWord->fresh();
    }
}
