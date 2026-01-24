<?php

namespace App\Services\External\HeadlessServices\Vignette;

use App\Services\External\HeadlessServices\HeadlessServicesAbstractApiClient;

class HeadlessServicesVignetteClient extends HeadlessServicesAbstractApiClient
{
    /**
     * Check vignette by registration number (GET method)
     */
    public function checkVignette(string $registrationNumber, string $country = 'BG'): array
    {
        $query = $country !== 'BG' ? '?country=' . urlencode($country) : '';
        return $this->request('get', '/vignette-check/' . urlencode($registrationNumber) . $query);
    }

    /**
     * Check vignette by registration number (POST method with options)
     */
    public function checkVignetteWithOptions(string $registrationNumber, string $country = 'BG'): array
    {
        return $this->request('post', '/vignette-check', [
            'registration' => $registrationNumber,
            'country' => $country,
        ]);
    }
}

