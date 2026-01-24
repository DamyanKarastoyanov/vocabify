<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(prepend: [
            \App\Http\Middleware\ThrottleRequests::class.':100,1',
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\PreventSearchEngineIndexing::class,
            \App\Http\Middleware\logAction::class,
        ]);

        $middleware->alias([
            'auth'               => \Illuminate\Auth\Middleware\Authenticate::class,
            'role'               => \Spatie\Permission\Middleware\RoleMiddleware::class,
        ]);

        //
    })
    ->withCommands([
        __DIR__.'/../app/Console/Axiom/NonResidentInsurance/Commands',
        __DIR__.'/../app/Console/Broqee/MTPLInsurance/Commands',
        __DIR__.'/../app/Console/Users/Commands',
    ])
    ->withEvents(discover: [
        __DIR__.'/../domain/Insurance/Events',
        __DIR__.'/../domain/Insurance/Listeners',
        __DIR__.'/../domain/Vehicles/Events',
        __DIR__.'/../domain/Vehicles/Listeners',
    ])
    ->withExceptions(function (Exceptions $exceptions) {
        \Spatie\LaravelFlare\Facades\Flare::handles($exceptions);
        
        $exceptions->respond(function ($response, Throwable $exception, Request $request) {
            $statusCode = $response->getStatusCode();
            if (/*! app()->environment(['local', 'testing']) &&*/ in_array($statusCode, [500, 503, 404, 403, 429])) {
                return Inertia::render('errors/errors', ['status' => $statusCode])
                    ->toResponse($request)
                    ->setStatusCode($statusCode);
            } elseif ($statusCode === 419) {
                return back()->with([
                    'message' => 'The page expired, please try again.',
                ]);
            }

            return $response;
        });
    })->create();
