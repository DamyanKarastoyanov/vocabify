<?php

namespace App\Http\Web\Practice\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Web\Practice\Requests\StartPracticeRequest;
use App\Http\Web\Practice\Requests\AnswerWordRequest;
use App\Http\Web\Practice\Resources\PracticeSessionResource;
use Domain\Vocabulary\Models\Dataset;
use Domain\Vocabulary\Models\PracticeSession;
use Domain\Vocabulary\Models\PracticeSessionItem;
use Domain\Vocabulary\Actions\StartPracticeSessionAction;
use Domain\Vocabulary\Actions\AnswerPracticeWordAction;
use Domain\Vocabulary\Actions\CompletePracticeSessionAction;
use Illuminate\Http\Request;    
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class PracticeController extends Controller
{
    public function __construct(
        private StartPracticeSessionAction $startPracticeSessionAction,
        private AnswerPracticeWordAction $answerPracticeWordAction,
        private CompletePracticeSessionAction $completePracticeSessionAction
    ) {
    }

    public function store(StartPracticeRequest $request, Dataset $dataset): \Illuminate\Http\RedirectResponse
    {
        $practiceSession = $this->startPracticeSessionAction->handle(
            dataset: $dataset,
            itemsCount: $request->getItemsPerSession(),
            userId: $request->user()?->id,
            mode: $request->getMode(),
            config: [
                'recallDirection' => $request->getRecallDirection(),
                'enableHints' => $request->getEnableHints(),
            ]
        );

        return redirect()->route('practice-sessions.show', [
            'practiceSession' => $practiceSession->id,
            'recallDirection' => $request->getRecallDirection(),
            'mode' => $request->getMode(),
            'enableHints' => $request->getEnableHints(),
        ], 303);
    }

    public function show(Request $request, PracticeSession $practiceSession): Response
    {
        $practiceSession->load(['practiceSessionItems.word.glosses', 'dataset']);

        if ($practiceSession->user_id !== $request->user()?->id) {
            abort(403);
        }

        $recallDirection = $request->query('recallDirection', 'mixed');
        $mode = $request->query('mode', 'paper');
        $enableHints = filter_var($request->query('enableHints', true), FILTER_VALIDATE_BOOLEAN);

        return Inertia::render('practice/practice', [
            'dataset' => [
                'id' => $practiceSession->dataset->id,
                'name' => $practiceSession->dataset->name,
            ],
            'practiceSession' => PracticeSessionResource::make($practiceSession),
            'recallDirection' => $recallDirection,
            'mode' => $mode,
            'enableHints' => $enableHints,
        ]);
    }

    public function answerWord(AnswerWordRequest $request, PracticeSessionItem $practiceSessionItem): JsonResponse
    {
        $this->answerPracticeWordAction->handle(
            practiceSessionItem: $practiceSessionItem,
            result: $request->getResult(),
            shownSide: $request->getShownSide(),
            responseMs: $request->getResponseMs()
        );

        return response()->json(['success' => true]);
    }

    public function complete(PracticeSession $practiceSession): JsonResponse
    {
        $this->completePracticeSessionAction->handle($practiceSession);

        return response()->json(['success' => true]);
    }
}
