<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Dataset;
use Domain\Vocabulary\Models\PracticeSession;
use Domain\Vocabulary\Models\PracticeSessionWord;
use Illuminate\Support\Collection;

class StartPracticeSessionAction
{
    public function handle(
        Dataset $dataset,
        int $itemsCount,
        ?int $userId = null
    ): PracticeSession {
        // Get actual count to handle cases where dataset has fewer words than requested
        $availableWordsCount = $dataset->words()->count();
        $actualItemsCount = min($itemsCount, $availableWordsCount);
        
        // Create the practice session
        $practiceSession = PracticeSession::create([
            'dataset_id' => $dataset->id,
            'user_id' => $userId,
            'items_count' => $actualItemsCount,
            'started_at' => now(),
        ]);

        // Select random words from the dataset
        $words = $dataset->words()
            ->inRandomOrder()
            ->limit($actualItemsCount)
            ->get();

        // Create PracticeSessionWord records with order_index
        $words->each(function ($word, $index) use ($practiceSession) {
            PracticeSessionWord::create([
                'practice_session_id' => $practiceSession->id,
                'word_id' => $word->id,
                'order_index' => $index + 1,
            ]);
        });

        // Reload the session with relationships
        return $practiceSession->load(['practiceSessionWords.word.glosses']);
    }
}
