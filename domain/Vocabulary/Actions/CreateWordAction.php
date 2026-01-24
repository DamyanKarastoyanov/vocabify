<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Word;

class CreateWordAction
{
    public function handle(
        int $datasetId,
        string $targetLanguageCode,
        string $primaryReading,
        ?string $alternativeWriting = null,
        ?string $romanization = null
    ): Word {
        return Word::create([
            'dataset_id'           => $datasetId,
            'target_language_code' => $targetLanguageCode,
            'primary_reading'      => $primaryReading,
            'alternative_writing'  => $alternativeWriting,
            'romanization'         => $romanization,
        ]);
    }
}
