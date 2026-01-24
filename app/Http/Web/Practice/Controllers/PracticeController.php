<?php

namespace App\Http\Web\Practice\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Web\Practice\Requests\StartPracticeRequest;
use App\Http\Web\Practice\Requests\AnswerWordRequest;
use App\Http\Web\Practice\Resources\PracticeSessionResource;
use Domain\Vocabulary\Models\Dataset;
use Domain\Vocabulary\Models\PracticeSession;
use Domain\Vocabulary\Models\PracticeSessionWord;
use Domain\Vocabulary\Actions\StartPracticeSessionAction;
use Domain\Vocabulary\Actions\AnswerPracticeWordAction;
use Domain\Vocabulary\Actions\CompletePracticeSessionAction;
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

    public function create(StartPracticeRequest $request, Dataset $dataset): Response
    {
        $itemsPerSession = $request->getItemsPerSession();
        $recallDirection = $request->getRecallDirection();
        $mode = $request->getMode();
        $enableHints = $request->getEnableHints();

        $practiceSession = $this->startPracticeSessionAction->handle(
            dataset: $dataset,
            itemsCount: $itemsPerSession,
            userId: $request->user()?->id
        );

        return Inertia::render('practice/practice', [
            'dataset' => [
                'id' => $dataset->id,
                'name' => $dataset->name,
            ],
            'practiceSession' => PracticeSessionResource::make($practiceSession),
            'recallDirection' => $recallDirection,
            'mode' => $mode,
            'enableHints' => $enableHints,
        ]);
    }

    public function answerWord(AnswerWordRequest $request, PracticeSessionWord $practiceSessionWord): JsonResponse
    {
        $result = $request->getResult();
        
        $this->answerPracticeWordAction->handle(
            practiceSessionWord: $practiceSessionWord,
            result: $result
        );

        return response()->json(['success' => true]);
    }

    public function complete(PracticeSession $practiceSession): JsonResponse
    {
        $this->completePracticeSessionAction->handle($practiceSession);

        return response()->json(['success' => true]);
    }
}
