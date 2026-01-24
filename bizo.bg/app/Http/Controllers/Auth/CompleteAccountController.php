<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Domain\Users\Actions\CreateProfileAction;
use Domain\Users\Actions\UpdateProfileAction;
use Domain\Users\Models\Activation;
use Domain\Users\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class CompleteAccountController extends Controller
{
    public function __construct(
        protected CreateProfileAction $createProfileAction,
        protected UpdateProfileAction $updateProfileAction,
    ) {
    }

    public function create(Request $request): Response
    {
        return Inertia::render('auth/complete-account/complete-account', [
            'token' => $request->route('token'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $activations = Activation::where('expires_at', '>', now())->get();

        $activation = $activations->first(function ($activation) use ($validated) {
            return Hash::check($validated['token'], $activation->token);
        });

        if (! $activation) {
            return redirect()->route('login')->withErrors(['token' => 'Activation token is invalid.']);
        }

        $user = User::find($activation->user_id);

        if ($user->profile) {
            $this->updateProfileAction->handle($user->profile, [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
            ]);
        } else {
            $profile = $this->createProfileAction->handle([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
            ]);

            $user->profile_id = $profile->id;
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        $activation->delete();

        return redirect()->route('login')->with('status', 'Account completed successfully. You can now log in.');
    }

}

