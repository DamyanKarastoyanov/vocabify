<?php

namespace Domain\Vehicles\Services;

use App\Services\External\HeadlessServices\RTA\HeadlessServicesRtaClient;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RtaInspectionService
{

    public function __construct(
        private readonly HeadlessServicesRtaClient $rtaClient
    ) {}

    /**
     * Check vehicle inspection status using headless client
     */
    public function checkInspection(string $registrationNumber, string $captchaCode, string $captchaSession): array
    {
        try {
            $result = $this->rtaClient->submitManualCaptcha($captchaSession, $captchaCode, $registrationNumber);

            if (isset($result['success']) && !$result['success']) {
                return $result;
            }

            if (isset($result['data'])) {
                if (!isset($result['data']['registration_number'])) {
                    $result['data']['registration_number'] = $registrationNumber;
                }

                return [
                    'success' => true,
                    'data' => $result['data'],
                ];
            }

            return $result;

        } catch (\Exception $e) {
            Log::error('RTA Inspection Service Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'registration_number' => $registrationNumber,
            ]);

            return [
                'success' => false,
                'message' => 'Възникна техническа грешка при проверката',
            ];
        }
    }
    /**
     * Get captcha image and session data using headless client
     */
    public function getCaptcha(): array
    {
        try {
            $result = $this->rtaClient->initManualCaptcha();

            if (isset($result['success']) && !$result['success']) {
                return $result;
            }

            $captchaImage = $result['captchaImage'] ?? null;
            if ($captchaImage && str_starts_with($captchaImage, 'data:image')) {
                $parts = explode(',', $captchaImage, 2);
                $captchaImage = $parts[1] ?? $captchaImage;
            }

            return [
                'success' => true,
                'captcha_image' => $captchaImage,
                'captcha_session' => $result['sessionId'] ?? null,
                'expires_at' => $result['expiresAt'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('RTA Inspection Captcha Service Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Грешка при зареждане на captcha',
            ];
        }
    }

}
