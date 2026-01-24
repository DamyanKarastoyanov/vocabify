<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventSearchEngineIndexing
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add X-Robots-Tag header to prevent search engine indexing
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive, noimageindex');
        
        return $response;
    }
}
