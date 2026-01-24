<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\PracticeSession;

class CompletePracticeSessionAction
{
    public function handle(PracticeSession $practiceSession): PracticeSession
    {
        $practiceSession->update([
            'completed_at' => now(),
        ]);

        return $practiceSession->fresh();
    }
}
