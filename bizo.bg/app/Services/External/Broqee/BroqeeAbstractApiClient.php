<?php

namespace App\Services\External\Broqee;

use App\Exceptions\ApiAuthenticationException;
use App\Exceptions\ApiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Log;

abstract class BroqeeAbstractApiClient
{
    protected string $baseUrl;
    protected string $apiKey;
    protected bool $hasRenewedToken = false;

    public function __construct(protected BroqeeApiTokenService $broqeeApiTokenService)
    {
        $this->baseUrl = config('broqee.api_base_url');
        $this->apiKey = $broqeeApiTokenService->getToken();
    }

    protected function request(string $method, string $uri, array $options = []): array
    {
        $shouldAppendProxyKey = config('broqee.api_auth_should_append_proxy_key', false);
        $shouldOverrideClientIpHeader = config('broqee.api_auth_should_override_x_client_ip_header', false);
        try {
            $headers = [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'X-Client' => config('broqee.api_x_client_header'),
                'X-Client-IP' => request()->ip(),
            ];
            if($shouldAppendProxyKey) {
                $headers['X-MTPL-Proxy-Key'] = config('broqee.api_auth_proxy_key');
            }
            if($shouldOverrideClientIpHeader) {
                $headers['X-Client-IP'] = config('broqee.api_auth_x_client_ip_header_override');
            }

            Log::info('Broqee API Request Headers:', $headers);

            $response = Http::withHeaders($headers)->retry(3, 100)->{$method}($this->baseUrl . $uri, $options);

            return $this->handleResponse($response);

        } catch (RequestException $e) {
            if (!$e->response) {
                throw new ApiException($e->getMessage(), $e->getCode() ?: 0, [], [], $this->baseUrl . $uri);
            }
            throw ApiException::fromHttpResponse($e->response, $this->baseUrl . $uri);
        } catch (ApiAuthenticationException $e) {
            if (!$this->hasRenewedToken) {
                $this->hasRenewedToken = true;
                $this->broqeeApiTokenService->forgetToken();
                $this->apiKey = $this->broqeeApiTokenService->getToken();
                return $this->request($method, $uri, $options);
            }
            throw $e;
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
