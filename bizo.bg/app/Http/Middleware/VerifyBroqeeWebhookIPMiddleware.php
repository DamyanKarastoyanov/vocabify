<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyBroqeeWebhookIPMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedIps = config('broqee.api_webhook_allowed_ips', []);

        if (in_array('*', $allowedIps, true)) {
            return $next($request);
        }

        if (! in_array($request->ip(), $allowedIps, true)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
