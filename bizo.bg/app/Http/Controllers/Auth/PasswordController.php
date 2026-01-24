<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $request->user()->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Текущата парола е неправилна.',
            ], 422);
        }

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Паролата е променена успешно',
        ]);
    }
}
