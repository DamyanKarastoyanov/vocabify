<?php

namespace App\Http\Web\Practice\Controllers;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Domain\Vocabulary\Models\PracticeSession;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PracticePdfController extends Controller
{
    public function __invoke(Request $request, PracticeSession $practiceSession): Response
    {
        if ($practiceSession->user_id !== $request->user()?->id) {
            abort(403, 'Unauthorized');
        }

        $practiceSession->load(['words', 'dataset']);

        $datasetName = $practiceSession->dataset->name;
        $targetLanguageCode = $practiceSession->dataset->target_language_code ?? 'jp';
        $words = $practiceSession->words;

        $html = view('pdf.practice-test', [
            'words' => $words,
            'datasetName' => $datasetName,
            'targetLanguageCode' => strtoupper($targetLanguageCode),
        ])->render();

        $pdf = Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->setOption('isFontSubsettingEnabled', true);

        $filename = sprintf(
            'practice-%s-%s.pdf',
            $practiceSession->id,
            now()->format('Y-m-d')
        );

        return $pdf->download($filename);
    }
}
