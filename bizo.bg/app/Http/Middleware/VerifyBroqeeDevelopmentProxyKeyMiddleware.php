<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyBroqeeDevelopmentProxyKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $providedKey = $request->header('X-MTPL-Proxy-Key');
        $validKey = config('broqee.api_auth_proxy_key');

        if (!$providedKey || $providedKey !== $validKey) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
