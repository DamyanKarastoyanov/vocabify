<?php

namespace App\Services\BroqeeDevelopmentProxy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BroqeeDevelopmentProxyController extends Controller
{
    public function handle(Request $request, string $endpoint)
    {
        // Base URL of provider’s test API
        $providerBaseUrl = config('broqee.api_base_url');

        // Build full target URL
        $targetUrl = rtrim($providerBaseUrl, '/') . '/' . ltrim($endpoint, '/');

        // Forward the request with original method, headers & body
        $response = Http::withHeaders($this->forwardedHeaders($request))
            ->send($request->method(), $targetUrl, [
                'query' => $request->query(),
                'body'  => $request->getContent(),
            ]);

        // Return provider’s response transparently
        return response($response->body(), $response->status())
            ->withHeaders($response->headers());
    }

    /**
     * Filter & forward only safe headers
     */
    private function forwardedHeaders(Request $request): array
    {
        $headers = [];

        foreach (['Authorization', 'Content-Type', 'Accept', 'X-Client', 'X-Client-IP'] as $header) {
            if ($request->hasHeader($header)) {
                $headers[$header] = $request->header($header);
            }
        }

        return $headers;
    }
}
