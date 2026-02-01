<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Vocabulary\DatasetImportController;
use App\Http\Web\Datasets\Controllers\DatasetsController;
use App\Http\Web\Practice\Controllers\PracticeController;
use App\Http\Web\Practice\Controllers\PracticePdfController;
use App\Http\Web\Practice\Controllers\PracticeSessionsController;
use App\Http\Web\Auth\Controllers\LoginController;
use App\Http\Web\Auth\Controllers\RegisterController;

Route::get('/', function () {
    return Inertia::render('home/home');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/datasets', [DatasetsController::class, 'index'])
        ->name('datasets.index');
    Route::get('/datasets/create', [DatasetsController::class, 'create'])
        ->name('datasets.create');
    Route::post('/datasets', [DatasetsController::class, 'store'])
        ->name('datasets.store');
    Route::get('/datasets/{dataset}', [DatasetsController::class, 'show'])
        ->name('datasets.show');
    Route::post('/datasets/{dataset}/import-words', [DatasetImportController::class, 'store'])
        ->name('datasets.import-words');
    
    Route::get('/practices', [PracticeSessionsController::class, 'index'])
        ->name('practices.index');
    Route::post('/datasets/{dataset}/practice-sessions', [PracticeController::class, 'store'])
        ->name('practice-sessions.store');
    Route::get('/practice-sessions/{practiceSession}', [PracticeController::class, 'show'])
        ->name('practice-sessions.show');
    Route::post('/practice-session-items/{practiceSessionItem}/answer', [PracticeController::class, 'answerWord'])
        ->name('practice.answer-word');
    Route::post('/practice-sessions/{practiceSession}/complete', [PracticeController::class, 'complete'])
        ->name('practice.complete');
    Route::get('/practice-sessions/{practiceSession}/pdf', PracticePdfController::class)
        ->name('practice.pdf');
});
