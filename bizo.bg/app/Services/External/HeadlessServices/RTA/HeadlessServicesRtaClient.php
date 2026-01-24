<?php

namespace App\Services\External\HeadlessServices\RTA;

use App\Services\External\HeadlessServices\HeadlessServicesAbstractApiClient;

class HeadlessServicesRtaClient extends HeadlessServicesAbstractApiClient
{
    /**
     * Check RTA vehicle inspection by registration number (GET method with automatic OCR)
     */
    public function checkRta(string $registrationNumber, bool $takeScreenshot = false): array
    {
        $query = $takeScreenshot ? '?takeScreenshot=true' : '';
        return $this->request('get', '/rta-check/' . urlencode($registrationNumber) . $query);
    }

    /**
     * Check RTA vehicle inspection (POST method with automatic OCR and options)
     */
    public function checkRtaWithOptions(string $registrationNumber, bool $takeScreenshot = false): array
    {
        return $this->request('post', '/rta-check', [
            'registration' => $registrationNumber,
            'takeScreenshot' => $takeScreenshot,
        ]);
    }

    /**
     * Initialize manual CAPTCHA solving session
     * Returns sessionId, captchaImage (base64), expiresAt, and registration
     */
    public function initManualCaptcha(): array
    {
        return $this->request('post', '/rta-check/manual/init');
    }

    /**
     * Submit manually solved CAPTCHA
     */
    public function submitManualCaptcha(string $sessionId, string $captcha, string $registrationNumber): array
    {
        return $this->request('post', '/rta-check/manual/submit', [
            'sessionId' => $sessionId,
            'captcha' => $captcha,
            'registration' => $registrationNumber,
        ]);
    }

    /**
     * Cleanup CAPTCHA session before expiration
     */
    public function cleanupCaptchaSession(string $sessionId): array
    {
        return $this->request('delete', '/rta-check/manual/session/' . urlencode($sessionId));
    }
}

