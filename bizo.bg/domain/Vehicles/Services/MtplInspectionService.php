<?php

namespace Domain\Vehicles\Services;

use App\Services\External\HeadlessServices\MTPL\HeadlessServicesMtplClient;

class MtplInspectionService
{
    public function __construct(
        private readonly HeadlessServicesMtplClient $mtplClient,
    ) {}

    /**
     * Check MTPL insurance status via proxy
     */
    public function checkMtpl(string $registrationNumber): array
    {
        try {
            $result = $this->mtplClient->checkMtpl($registrationNumber);

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

