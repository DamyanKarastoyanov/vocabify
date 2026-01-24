<?php

namespace App\Services\External\HeadlessServices\MTPL;

use App\Services\External\HeadlessServices\HeadlessServicesAbstractApiClient;

class HeadlessServicesMtplClient extends HeadlessServicesAbstractApiClient
{
    /**
     * Check MTPL insurance by registration number (GET method)
     */
    public function checkMtpl(string $registrationNumber, bool $takeScreenshot = false): array
    {
        $query = $takeScreenshot ? '?takeScreenshot=true' : '';
        return $this->request('get', '/mtpl-check/' . urlencode($registrationNumber) . $query);
    }

    /**
     * Check MTPL insurance by registration number (POST method with options)
     */
    public function checkMtplWithOptions(string $registrationNumber, bool $takeScreenshot = false): array
    {
        return $this->request('post', '/mtpl-check', [
            'registration' => $registrationNumber,
            'takeScreenshot' => $takeScreenshot,
        ]);
    }
}

