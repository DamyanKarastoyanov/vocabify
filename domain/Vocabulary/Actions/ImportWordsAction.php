<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Dataset;
use Domain\Vocabulary\Models\Gloss;

class ImportWordsAction
{
    public function __construct(
        private CreateWordAction $createWordAction,
        private CreateGlossAction $createGlossAction
    ) {
    }

    public function handle(
        Dataset $dataset,
        string $content,
        string $middleLanguageCode
    ): array {
        $lines = preg_split('/\r\n|\r|\n/', $content);
        $targetLanguageCode = $dataset->target_language_code;
        $nativeLanguageCode = 'bg';

        $importedCount = 0;
        $skippedCount  = 0;
        $errors        = [];

        foreach ($lines as $index => $rawLine) {
            $lineNumber = $index + 1;
            $line = trim($rawLine);

            if ($line === '') {
                continue;
            }

            $parts = explode(' - ', $line);

            if (count($parts) < 3) {
                $skippedCount++;
                $errors[] = [
                    'line'    => $lineNumber,
                    'reason'  => 'Expected at least 3 fields: hiragana - kanji - bulgarian',
                    'content' => $rawLine,
                ];
                continue;
            }

            $parts = array_pad($parts, 4, null);
            [$hiragana, $kanji, $bulgarian, $middle] = $parts;

            $hiragana  = trim((string) $hiragana);
            $kanji     = trim((string) $kanji);
            $bulgarian = trim((string) $bulgarian);
            $middle    = $middle !== null ? trim((string) $middle) : null;

            if ($hiragana === '' || $kanji === '' || $bulgarian === '') {
                $skippedCount++;
                $errors[] = [
                    'line'    => $lineNumber,
                    'reason'  => 'Missing one of: hiragana, kanji, bulgarian',
                    'content' => $rawLine,
                ];
                continue;
            }

            $word = $this->createWordAction->handle(
                datasetId: $dataset->id,
                targetLanguageCode: $targetLanguageCode,
                primaryReading: $hiragana,
                alternativeWriting: $kanji,
                romanization: null
            );

            $this->createGlossAction->handle(
                word: $word,
                languageCode: $nativeLanguageCode,
                meaningText: $bulgarian,
                role: Gloss::ROLE_NATIVE,
                isPrimary: true
            );

            if ($middle !== null && $middle !== '') {
                $this->createGlossAction->handle(
                    word: $word,
                    languageCode: $middleLanguageCode,
                    meaningText: $middle,
                    role: Gloss::ROLE_MIDDLE,
                    isPrimary: true
                );
            }

            $importedCount++;
        }

        return [
            'imported_count' => $importedCount,
            'skipped_count'  => $skippedCount,
            'errors'         => $errors,
        ];
    }
}
