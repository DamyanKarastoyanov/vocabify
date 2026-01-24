<?php

namespace Domain\Vehicles\Services;

use App\Services\External\HeadlessServices\Vignette\HeadlessServicesVignetteClient;

class VignetteInspectionService
{
    public function __construct(
        private readonly HeadlessServicesVignetteClient $vignetteClient,
    ) {}

    /**
     * Check vignette status via proxy
     */
    public function checkVignette(string $registrationNumber, string $country = 'BG'): array
    {
        try {
            $result = $this->vignetteClient->checkVignette($registrationNumber, $country);

            return $this->transformProxyResponse($result);
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Възникна техническа грешка при проверката',
            ];
        }
    }

    /**
     * Transform proxy response to expected format
     */
    private function transformProxyResponse(array $proxyResponse): array
    {
        if (isset($proxyResponse['success']) && !$proxyResponse['success']) {
            return $proxyResponse;
        }

        if (isset($proxyResponse['data'])) {
            return ['success' => true, 'data' => $proxyResponse['data']];
        }

        return $proxyResponse;
    }
}

