<?php

namespace App\Http\Web\Datasets\Queries;

use Domain\Vocabulary\Models\Dataset;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class DatasetsQuery
{
    public function __construct(
        protected Request $request
    ) {
    }

    public function get(): Collection
    {
        $user = $this->request->user();

        if (!$user) {
            return new Collection();
        }

        return Dataset::query()
            ->where('user_id', $user->id)
            ->withCount('words')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
