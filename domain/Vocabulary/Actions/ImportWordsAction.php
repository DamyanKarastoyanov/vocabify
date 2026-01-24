<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Dataset;
use Domain\Vocabulary\Models\Gloss;

class ImportWordsAction
{
    public function __construct(
        private CreateWordAction $createWordAction,
        private CreateGlossAction $createGlossAction,
        private FindOrCreateTagAction $findOrCreateTagAction
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

            // Skip blank lines
            if ($line === '') {
                continue;
            }

            // Split on first | to separate word part from tags part
            $pipeParts = explode('|', $line, 2);
            $wordPart = trim($pipeParts[0]);
            $tagsPart = isset($pipeParts[1]) ? trim($pipeParts[1]) : '';

            // Parse word part (comma-separated)
            $wordFields = array_map('trim', explode(',', $wordPart));

            // Validate word part: must have 3 or 4 fields
            if (count($wordFields) < 3 || count($wordFields) > 4) {
                $skippedCount++;
                $errors[] = [
                    'line'    => $lineNumber,
                    'reason'  => 'Word part must have 3 or 4 comma-separated fields: reading,kanji,native[,middle]',
                    'content' => $rawLine,
                ];
                continue;
            }

            [$reading, $kanji, $native, $middle] = array_pad($wordFields, 4, null);

            $reading = trim((string) $reading);
            $kanji = trim((string) $kanji);
            $native = trim((string) $native);
            $middle = $middle !== null ? trim((string) $middle) : null;

            // Validate required fields
            if ($reading === '' || $native === '') {
                $skippedCount++;
                $errors[] = [
                    'line'    => $lineNumber,
                    'reason'  => 'Reading and native fields are required and cannot be empty',
                    'content' => $rawLine,
                ];
                continue;
            }

            // Optional strictness: check if all fields are empty (skip as blank line)
            $allEmpty = $reading === '' && $kanji === '' && $native === '' && ($middle === null || $middle === '');
            if ($allEmpty) {
                continue;
            }

            // Create word
            $word = $this->createWordAction->handle(
                datasetId: $dataset->id,
                targetLanguageCode: $targetLanguageCode,
                primaryReading: $reading,
                alternativeWriting: $kanji === '' ? null : $kanji,
                romanization: null
            );

            // Create native gloss
            $this->createGlossAction->handle(
                word: $word,
                languageCode: $nativeLanguageCode,
                meaningText: $native,
                role: Gloss::ROLE_NATIVE,
                isPrimary: true
            );

            // Create middle gloss if present
            if ($middle !== null && $middle !== '') {
                $this->createGlossAction->handle(
                    word: $word,
                    languageCode: $middleLanguageCode,
                    meaningText: $middle,
                    role: Gloss::ROLE_MIDDLE,
                    isPrimary: true
                );
            }

            // Parse and attach tags
            if ($tagsPart !== '') {
                $tagNames = array_map('trim', explode(',', $tagsPart));
                $tagNames = array_filter($tagNames, fn($tag) => $tag !== '');

                foreach ($tagNames as $tagName) {
                    $tag = $this->findOrCreateTagAction->handle(
                        datasetId: $dataset->id,
                        tagName: $tagName
                    );
                    if (!$word->tags()->where('tag_id', $tag->id)->exists()) {
                        $word->tags()->attach($tag->id);
                    }
                }
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
