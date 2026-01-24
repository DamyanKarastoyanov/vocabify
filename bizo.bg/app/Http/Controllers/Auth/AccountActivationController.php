<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Domain\Users\Actions\ActivateUserAction;
use Domain\Users\Models\Activation;
use Domain\Users\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountActivationController extends Controller
{
    public function __invoke(Request $request, String $token, ActivateUserAction $activateUserAction): RedirectResponse
    {
        $activations = Activation::where('expires_at', '>', now())->get();

        $activation = $activations->first(function ($activation) use ($request) {
            return Hash::check($request->token, $activation->token);
        });

        if(!$activation) {
            return redirect()->route('login')->withErrors(['token' => 'Activation token is invalid.']);
        }

        $user = User::find($activation->user_id);

        $activateUserAction->handle($user);

        return redirect()->route('account.complete', ['token' => $request->token])->with('status', 'Your account is now active. Please complete your account.');
    }
}
