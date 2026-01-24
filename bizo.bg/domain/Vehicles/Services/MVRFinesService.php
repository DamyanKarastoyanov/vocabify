<?php

namespace Domain\Vehicles\Services;

use App\Services\External\HeadlessServices\MVRFines\HeadlessServicesMVRFinesClient;

class MVRFinesService
{
    public function __construct(
        private readonly HeadlessServicesMVRFinesClient $mvrFinesClient,
    ) {}

    /**
     * Check MVR fines via proxy
     */
    public function checkMVRFines(string $egn, string $drivingLicenceNumber): array
    {
        try {
            $result = $this->mvrFinesClient->checkMVRFines($egn, $drivingLicenceNumber);

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

