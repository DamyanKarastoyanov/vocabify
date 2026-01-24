<?php

namespace App\Services\External\Axiom;

use App\Exceptions\ApiAuthenticationException;
use App\Exceptions\ApiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Client\RequestException;

abstract class AxiomAbstractApiClient
{
    protected string $baseUrl;
    protected string $apiKey;
    protected bool $hasRenewedToken = false;

    public function __construct(protected AxiomApiTokenService $axiomApiTokenService)
    {
        $this->baseUrl = config('axiom.api_base_url');
        $this->apiKey = $axiomApiTokenService->getToken();
    }

    protected function request(string $method, string $uri, array $options = []): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->retry(3, 100)->{$method}($this->baseUrl . $uri, $options);

            return $this->handleResponse($response);

        } catch (RequestException $e) {
            if (!$e->response) {
                throw new ApiException($e->getMessage(), $e->getCode() ?: 0, [], [], $this->baseUrl . $uri);
            }
            throw ApiException::fromHttpResponse($e->response, $this->baseUrl . $uri);
        } catch (ApiAuthenticationException $e) {
            if (!$this->hasRenewedToken) {
                $this->hasRenewedToken = true;
                $this->axiomApiTokenService->forgetToken();
                $this->apiKey = $this->axiomApiTokenService->getToken();
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
