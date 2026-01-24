<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Domain\Users\Actions\CreateUserAction;
use Domain\Users\Actions\NotifyAccountActivationAction;
use Domain\Users\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        protected CreateUserAction $createUserAction,
        protected NotifyAccountActivationAction $notifyAccountActivationAction,
    ) {
        //
    }
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register/register-email');
    }

    public function email(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::firstWhere('email', $request->email);
        
        if(!$user) {
            $user = $this->createUserAction->handle([
                'email' => $request->email,
                'is_active' => false,
                'password' => User::DEFAULT_PASSWORD,
            ]);
        }

        $this->notifyAccountActivationAction->handle($user);

        return Inertia::render('auth/activate-account/activate-account', [
            'status' => 'Activation email sent successfully. Please check your inbox.',
        ]);
    }

}
