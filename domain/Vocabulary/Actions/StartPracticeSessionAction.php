<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Dataset;
use Domain\Vocabulary\Models\PracticeSession;
use Domain\Vocabulary\Models\PracticeSessionItem;

class StartPracticeSessionAction
{
    public function handle(
        Dataset $dataset,
        int $itemsCount,
        ?int $userId = null,
        ?string $mode = null,
        ?array $config = null
    ): PracticeSession {
        $availableWordsCount = $dataset->words()->count();
        $actualItemsCount = min($itemsCount, $availableWordsCount);

        $practiceSession = PracticeSession::create([
            'dataset_id' => $dataset->id,
            'user_id' => $userId,
            'mode' => $mode,
            'total_items' => $actualItemsCount,
            'config' => $config,
            'started_at' => now(),
        ]);

        $words = $dataset->words()
            ->inRandomOrder()
            ->limit($actualItemsCount)
            ->get();

        $words->each(function ($word, $index) use ($practiceSession) {
            PracticeSessionItem::create([
                'practice_session_id' => $practiceSession->id,
                'word_id' => $word->id,
                'position' => $index + 1,
            ]);
        });

        return $practiceSession->load(['practiceSessionItems.word.glosses']);
    }
}
