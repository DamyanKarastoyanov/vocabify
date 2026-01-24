<?php

use App\Http\Controllers\Auth\AccountActivationController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\CompleteAccountController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register-email', [RegisteredUserController::class, 'email'])
        ->name('register-email');

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    Route::get('activate/{token}', AccountActivationController::class)
        ->name('account.activate');

    Route::get('complete-account/{token}', [CompleteAccountController::class, 'create'])
        ->name('account.complete');

    Route::post('complete-account', [CompleteAccountController::class, 'store'])
        ->name('account.complete.store');
});

Route::middleware('auth')->group(function () {
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('user-password-reset', [PasswordResetLinkController::class, 'createFromProfile'])
        ->name('user.password.reset');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout.get');
});
