<?php

namespace Domain\Vocabulary\Actions;

use Domain\Vocabulary\Models\Tag;
use Illuminate\Support\Str;

class FindOrCreateTagAction
{
    public function handle(int $datasetId, string $tagName): Tag
    {
        $slug = Str::slug($tagName);

        return Tag::firstOrCreate(
            [
                'dataset_id' => $datasetId,
                'slug'       => $slug,
            ],
            [
                'name' => $tagName,
            ]
        );
    }
}
