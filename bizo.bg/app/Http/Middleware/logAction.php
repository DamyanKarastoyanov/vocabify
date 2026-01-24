<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class logAction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //TODO:move the routes to API
        $exceptionPaths = [
            // to be considered
        ];

        $exceptionPartOfPaths = [
            // to be considered
        ];

        if (! in_array(urldecode($request->path()), $exceptionPaths)
            && ! preg_match('('.implode('|', array_map('preg_quote', $exceptionPartOfPaths)).')', urldecode($request->path()), $m)
            && $request->isXmlHttpRequest() === false
            && Auth::check()
        ) {
            activity()
                ->withProperties(['url' => $request->url()])
                ->log('route');
        }

        return $next($request);
    }
}

