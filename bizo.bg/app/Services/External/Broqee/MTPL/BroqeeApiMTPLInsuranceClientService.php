<?php

namespace App\Services\External\Broqee\MTPL;

use App\Services\External\Broqee\BroqeeAbstractApiClient;

class BroqeeApiMTPLInsuranceClientService extends BroqeeAbstractApiClient
{
    public function getNomenclatureList(): array
    {
        return $this->request('get', '/nomen/list');
    }

    public function getInsurersNomenclature(): array
    {
        return $this->request('get', '/nomen/insurers');
    }

    public function getVehicleUsagesNomenclature(): array
    {
        return $this->request('get', '/nomen/vehicle_usages');
    }

    public function getLocationsNomenclature(): array
    {
        return $this->request('get', '/nomen/locations');
    }

    public function getVehicle(string $number, string $talon): array
    {
        return $this->request('post', '/find/vehicle',
            [
                'vehicle' => [
                    'number' => $number,
                    'talon' => $talon,
                ]
            ]
        );
    }

    public function getPerson(string $number, string $talon): array
    {
        return $this->request('post', '/find/person',
            [
                'vehicle' => [
                    'number' => $number,
                    'talon' => $talon,
                ]
            ]
        );
    }

    public function calculateMTPL(array $data): array
    {
        return $this->request('post', '/mtpl/calc', $data);
    }

    public function getOffer(int $offer_id): array
    {
        return $this->request('post', '/mtpl/check', [
            'calculation' => $offer_id
        ]);
    }

    public function chooseInsurer(int $offer_id): array
    {
        return $this->request('post', '/mtpl/choose', [
            'offer' => $offer_id
        ]);
    }

    public function confirmOffer(array $data): array
    {
        return $this->request('post', '/mtpl/confirm', $data);
    }

    public function issuePolicy(int $order_id): array
    {
        return $this->request('post', '/mtpl/issue', [
            'order' => $order_id
        ]);
    }
}
