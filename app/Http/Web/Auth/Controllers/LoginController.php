<?php

namespace App\Http\Web\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Web\Auth\Requests\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/login/login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('datasets.index', absolute: false));
    }

    public function destroy(\Illuminate\Http\Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
