<?php

namespace App\Services\External\HeadlessServices;

use App\Exceptions\ApiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Client\RequestException;

abstract class HeadlessServicesAbstractApiClient
{
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('headless-services.base_url');
        $this->timeout = config('headless-services.timeout', 30);
    }

    protected function request(string $method, string $uri, array $options = []): array
    {
        try {
            return retry(3, function () use ($method, $uri, $options) {
                $http = Http::timeout($this->timeout)
                    ->acceptJson();

                // For POST/PUT/PATCH/DELETE with body data, send as JSON
                if (in_array(strtolower($method), ['post', 'put', 'patch']) && !empty($options)) {
                    $http = $http->asJson();
                }

                $response = $http->{$method}($this->baseUrl . $uri, $options);

                return $this->handleResponse($response);
            }, 100);
        } catch (\Exception $e) {
            if ($e instanceof RequestException && $e->response) {
                throw ApiException::fromHttpResponse($e->response, 'headless://redacted');
            }
            throw new ApiException('Service temporarily unavailable', 503, [], [], 'headless://redacted');
        }
    }

    protected function handleResponse(Response $response): array
    {
        if ($response->successful()) {
            if ($this->isJson($response)) {
                $data = $response->json();
                if (isset($data['success']) && $data['success'] === false) {
                    throw ApiException::fromHttpResponse($response, $response->effectiveUri()->__toString());
                }
                return $data;
            }
            return ['data' => $response->body()];
        }
        throw ApiException::fromHttpResponse($response, $response->effectiveUri()->__toString());
    }

    protected function isJson(Response $response): bool
    {
        $contentType = $response->header('Content-Type');
        return $contentType && str_contains($contentType, 'application/json');
    }
}

