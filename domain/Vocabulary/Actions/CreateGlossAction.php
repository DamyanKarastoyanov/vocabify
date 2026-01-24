<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Gloss;
use Domain\Vocabulary\Models\Word;

class CreateGlossAction
{
    public function handle(
        Word $word,
        string $languageCode,
        string $meaningText,
        string $role,
        bool $isPrimary = true
    ): Gloss {
        return Gloss::create([
            'word_id'       => $word->id,
            'language_code' => $languageCode,
            'meaning_text'  => $meaningText,
            'role'          => $role,
            'is_primary'    => $isPrimary,
        ]);
    }
}
