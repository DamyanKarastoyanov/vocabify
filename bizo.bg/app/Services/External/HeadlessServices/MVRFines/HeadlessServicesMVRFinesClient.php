<?php

namespace App\Services\External\HeadlessServices\MVRFines;

use App\Services\External\HeadlessServices\HeadlessServicesAbstractApiClient;

class HeadlessServicesMVRFinesClient extends HeadlessServicesAbstractApiClient
{
    /**
     * Check MVR fines by EGN and driving licence number (POST method)
     */
    public function checkMVRFines(string $egn, string $drivingLicenceNumber): array
    {
        return $this->request('post', '/mvr-fines-check', [
            'egn' => $egn,
            'drivingLicenceNumber' => $drivingLicenceNumber,
        ]);
    }
}

