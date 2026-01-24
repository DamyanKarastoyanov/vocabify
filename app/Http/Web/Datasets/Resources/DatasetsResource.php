<?php

namespace App\Http\Web\Datasets\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DatasetsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // If resource is a collection, map each item
        if ($this->resource instanceof \Illuminate\Database\Eloquent\Collection) {
            return $this->resource->map(function ($dataset) {
                return $this->transformDataset($dataset);
            })->toArray();
        }

        // If resource is a single model
        return $this->transformDataset($this);
    }

    private function transformDataset($dataset): array
    {
        $wordsCount = $dataset->words_count ?? $dataset->words()->count();
        
        // TODO: Calculate real progress stats from Session/SessionItem data
        // For now, return placeholder structure
        $knownCount = 0;
        $learningCount = 0;
        $newCount = $wordsCount;
        
        if ($wordsCount > 0) {
            // Placeholder: distribute words across states
            $knownCount = (int) ($wordsCount * 0.5);
            $learningCount = (int) ($wordsCount * 0.3);
            $newCount = $wordsCount - $knownCount - $learningCount;
        }

        $knownPercent = $wordsCount > 0 ? round(($knownCount / $wordsCount) * 100) : 0;
        $learningPercent = $wordsCount > 0 ? round(($learningCount / $wordsCount) * 100) : 0;
        $newPercent = $wordsCount > 0 ? round(($newCount / $wordsCount) * 100) : 0;

        // TODO: Get real last practiced date from Session model
        $lastPracticed = $dataset->updated_at;

        // TODO: Get real tags from dataset_tags table or similar
        $tags = [];

        return [
            'id' => $dataset->id,
            'name' => $dataset->name,
            'target_language_code' => $dataset->target_language_code,
            'user_id' => $dataset->user_id,
            'words_count' => $wordsCount,
            'created_at' => $dataset->created_at?->format('Y-m-d'),
            'updated_at' => $dataset->updated_at?->format('Y-m-d'),
            'last_practiced_at' => $lastPracticed?->diffForHumans(),
            'progress' => [
                'known' => [
                    'count' => $knownCount,
                    'percent' => $knownPercent,
                ],
                'learning' => [
                    'count' => $learningCount,
                    'percent' => $learningPercent,
                ],
                'new' => [
                    'count' => $newCount,
                    'percent' => $newPercent,
                ],
            ],
            'tags' => $tags,
        ];
    }
}
