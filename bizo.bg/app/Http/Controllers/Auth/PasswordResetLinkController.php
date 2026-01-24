<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Domain\Users\Actions\GeneratePasswordResetDataAction;
use Domain\Users\Actions\SendPasswordResetLinkAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class PasswordResetLinkController extends Controller
{
    private const SUCCESS_MESSAGE = 'Изпратихме ти линк за възстановяване на паролата по имейл. Провери входящата си поща, но ако не го намираш, хвърли едно око и в „Спам" или „Промоции". Понякога се скрива там.';

    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/forgot-password/forgot-password', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request, SendPasswordResetLinkAction $sendPasswordResetLinkAction): JsonResponse|RedirectResponse
    {
        $email = $this->validateAndGetEmail($request);
        $sendPasswordResetLinkAction->handle($email);

        return back()->with('status', self::SUCCESS_MESSAGE);
    }

    /**
     * Handle password reset link request from profile form.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createFromProfile(Request $request, GeneratePasswordResetDataAction $generatePasswordResetDataAction): JsonResponse|RedirectResponse
    {
        $email = $this->validateAndGetEmail($request);
        $generatePasswordResetDataAction->handle($email);

        return redirect()->route('profile')->with('success', self::SUCCESS_MESSAGE);
    }

    /**
     * Validate request and extract email.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validateAndGetEmail(Request $request): string
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        return $request->input('email');
    }
}
