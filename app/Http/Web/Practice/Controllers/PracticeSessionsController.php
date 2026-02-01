<?php

namespace App\Http\Web\Practice\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Web\Practice\Resources\PracticeSessionListResource;
use Domain\Vocabulary\Models\PracticeSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PracticeSessionsController extends Controller
{
    public function index(Request $request): Response
    {
        $sessions = PracticeSession::query()
            ->where('user_id', $request->user()->id)
            ->with('dataset:id,name')
            ->orderByDesc('started_at')
            ->get();

        return Inertia::render('practices/practices', [
            'practiceSessions' => PracticeSessionListResource::collection($sessions),
        ]);
    }
}
