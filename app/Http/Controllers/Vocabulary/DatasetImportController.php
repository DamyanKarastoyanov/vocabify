<?php

namespace App\Http\Controllers\Vocabulary;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Domain\Vocabulary\Models\Dataset;
use Domain\Vocabulary\Actions\ImportWordsAction;

class DatasetImportController extends Controller
{
    public function __construct(
        private ImportWordsAction $importWordsAction
    ) {
    }

    public function store(Request $request, Dataset $dataset)
    {
        // Ownership guard
        if ($dataset->user_id && $dataset->user_id !== $request->user()->id) {
            abort(403, 'You do not have permission to import into this dataset.');
        }

        $data = $request->validate([
            'content' => ['required', 'string'],
            'middle_language_code' => ['required', 'string', 'min:2', 'max:5'],
        ]);

        try {
            $result = $this->importWordsAction->handle(
                dataset: $dataset,
                content: $data['content'],
                middleLanguageCode: $data['middle_language_code']
            );

            return response()->json([
                'success'        => true,
                'dataset_id'     => $dataset->id,
                'imported_count' => $result['imported_count'],
                'skipped_count'  => $result['skipped_count'],
                'line_errors'    => $result['errors'],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success'     => false,
                'message'     => 'Import failed.',
                'error'       => $e->getMessage(),
            ], 500);
        }
    }
}
