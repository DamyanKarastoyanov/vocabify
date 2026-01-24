<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Dataset;

class CreateDatasetAction
{
    public function handle(
        string $name,
        string $targetLanguageCode,
        ?int $userId = null
    ): Dataset {
        return Dataset::create([
            'name'                => $name,
            'target_language_code' => $targetLanguageCode,
            'user_id'             => $userId,
        ]);
    }
}
