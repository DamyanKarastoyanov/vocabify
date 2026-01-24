<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;

class WithoutJsonDataWrapping
{
    /**
     * Handle an incoming request.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function handle(Request $request, Closure $next): Response
    {
        JsonResource::withoutWrapping();

        return $next($request);
    }
}
