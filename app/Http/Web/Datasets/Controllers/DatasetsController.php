<?php

namespace App\Http\Web\Datasets\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Web\Datasets\Queries\DatasetsQuery;
use App\Http\Web\Datasets\Resources\DatasetsResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Domain\Vocabulary\Actions\CreateDatasetAction;
use Domain\Vocabulary\Actions\ImportWordsAction;

class DatasetsController extends Controller
{
    public function __construct(
        private CreateDatasetAction $createDatasetAction,
        private ImportWordsAction $importWordsAction
    ) {
    }

    public function index(Request $request): Response
    {
        return inertia('datasets/datasets', [
            'datasets' => fn() => DatasetsResource::make((new DatasetsQuery($request))->get()),
        ]);
    }

    public function create()
    {
        return Inertia::render('dataset-import/dataset-import');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'                 => ['required', 'string', 'max:255'],
            'target_language_code' => ['required', 'string', 'min:2', 'max:5'],
            'content'              => ['required', 'string'],
            'middle_language_code' => ['required', 'string', 'min:2', 'max:5'],
        ]);

        try {
            $dataset = $this->createDatasetAction->handle(
                name: $data['name'],
                targetLanguageCode: $data['target_language_code'],
                userId: $request->user()?->id
            );

            $result = $this->importWordsAction->handle(
                dataset: $dataset,
                content: $data['content'],
                middleLanguageCode: $data['middle_language_code']
            );

            return response()->json([
                'success'        => true,
                'dataset_id'     => $dataset->id,
                'dataset_name'   => $dataset->name,
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
