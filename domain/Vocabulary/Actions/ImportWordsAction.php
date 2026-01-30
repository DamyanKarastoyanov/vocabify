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

        $errors = [];
        $validRows = [];

        // First pass: validate every line and collect valid parsed rows
        foreach ($lines as $index => $rawLine) {
            $lineNumber = $index + 1;
            $line = trim($rawLine);

            if ($line === '') {
                continue;
            }

            $pipeParts = explode('|', $line, 2);
            $wordPart = trim($pipeParts[0]);
            $tagsPart = isset($pipeParts[1]) ? trim($pipeParts[1]) : '';
            // Allow commas inside fields: treat as 3 or 4 fields — last segment = middle when 4+
            $segments = array_map('trim', explode(',', $wordPart));
            $segmentCount = count($segments);

            if ($segmentCount < 3) {
                $errors[] = [
                    'line'    => $lineNumber,
                    'reason'  => 'Word part must have 3 or 4 comma-separated fields: reading,kanji,native[,middle]',
                    'content' => $rawLine,
                ];
                continue;
            }

            if ($segmentCount === 3) {
                $reading = $segments[0];
                $kanji = $segments[1];
                $native = $segments[2];
                $middle = null;
            } else {
                $middle = array_pop($segments);
                $reading = $segments[0];
                $kanji = $segments[1];
                $native = implode(',', array_slice($segments, 2));
            }

            if ($reading === '' || $native === '') {
                $errors[] = [
                    'line'    => $lineNumber,
                    'reason'  => 'Reading and native fields are required and cannot be empty',
                    'content' => $rawLine,
                ];
                continue;
            }

            $allEmpty = $reading === '' && $kanji === '' && $native === '' && ($middle === null || $middle === '');
            if ($allEmpty) {
                continue;
            }

            $validRows[] = [
                'reading'  => $reading,
                'kanji'    => $kanji,
                'native'   => $native,
                'middle'   => $middle,
                'tagsPart' => $tagsPart,
            ];
        }

        // If any validation errors: hold up import — do not write to DB
        if ($errors !== []) {
            return [
                'imported_count' => 0,
                'skipped_count'  => count($errors),
                'errors'         => $errors,
                'validation_failed' => true,
            ];
        }

        // Second pass: create words and glosses only when validation passed
        $importedCount = 0;
        foreach ($validRows as $row) {
            $word = $this->createWordAction->handle(
                datasetId: $dataset->id,
                targetLanguageCode: $targetLanguageCode,
                primaryReading: $row['reading'],
                alternativeWriting: $row['kanji'] === '' ? null : $row['kanji'],
                romanization: null
            );

            $this->createGlossAction->handle(
                word: $word,
                languageCode: $nativeLanguageCode,
                meaningText: $row['native'],
                role: Gloss::ROLE_NATIVE,
                isPrimary: true
            );

            if ($row['middle'] !== null && $row['middle'] !== '') {
                $this->createGlossAction->handle(
                    word: $word,
                    languageCode: $middleLanguageCode,
                    meaningText: $row['middle'],
                    role: Gloss::ROLE_MIDDLE,
                    isPrimary: true
                );
            }

            if ($row['tagsPart'] !== '') {
                $tagNames = array_map('trim', explode(',', $row['tagsPart']));
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
            'skipped_count'  => 0,
            'errors'         => [],
        ];
    }
}
