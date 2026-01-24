<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests as BaseThrottleRequests;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ThrottleRequests extends BaseThrottleRequests
{
    /**
     * Create a 'too many attempts' exception.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $key
     * @param  int  $maxAttempts
     * @param  callable|null  $responseCallback
     * @return \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function buildException($request, $key, $maxAttempts, $responseCallback = null)
    {
        $retryAfter = $this->getTimeUntilNextRetry($key);

        $headers = $this->getHeaders(
            $maxAttempts,
            $this->calculateRemainingAttempts($key, $maxAttempts, $retryAfter),
            $retryAfter
        );

        $response = Inertia::render('errors/errors', [
            'status' => 429,
            'seconds' => $retryAfter,
            'minutes' => ceil($retryAfter / 60),
        ])
            ->toResponse($request)
            ->setStatusCode(429)
            ->withHeaders($headers);

        return new HttpResponseException($response);
    }
}

