<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Log;

class ApiException extends Exception
{
    protected array $responseBody;
    protected int $statusCode;
    protected array $headers = [];
    protected ?string $endpoint = null;

    public function __construct(string $message, int $statusCode = 0, array $responseBody = [], array $headers = [], ?string $endpoint = null)
    {
        parent::__construct($message, $statusCode);
        $this->statusCode = $statusCode;
        $this->responseBody = $responseBody;
        $this->headers = $headers;
        $this->endpoint = $endpoint;

        Log::error('API Error', [
            'endpoint' => $endpoint,
            'status' => $statusCode,
            'response' => $responseBody,
        ]);
    }

    public static function fromHttpResponse(Response $response, ?string $endpoint = null): ApiException
    {
        $status = $response->getStatusCode();
        $body = json_decode((string) $response->getBody(), true) ?? [];
        $message = $body['message'] ?? 'API error occurred.';
        $headers = $response->getHeaders();

        // Check for "logical" failure inside 200 OK response
        if ($status === 200 && isset($body['success']) && $body['success'] === false) {
            return new ApiLogicalException(
                $body['errors'][0] ?? $message,
                $status,
                $body,
                $headers,
                $endpoint
            );
        }

        return match (true) {
            $status === 400, $status === 422 => new ApiValidationException($message, $status, $body, $headers, $endpoint),
            $status === 401 => new ApiAuthenticationException($message, $status, $body, $headers, $endpoint),
            $status === 429 => new ApiRateLimitException($message, $status, $body, $headers, $endpoint),
            $status >= 500 => new ApiServerException($message, $status, $body, $headers, $endpoint),
            default => new ApiException($message, $status, $body, $headers, $endpoint),
        };
    }

    public function getResponseBody(): array
    {
        return $this->responseBody;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}
