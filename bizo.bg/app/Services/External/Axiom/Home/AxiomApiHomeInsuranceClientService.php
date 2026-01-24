<?php

namespace App\Services\External\Axiom\Home;

use App\Services\External\Axiom\AxiomAbstractApiClient;

class AxiomApiHomeInsuranceClientService extends AxiomAbstractApiClient
{
    public function getCalculatedPrice(array $data): array
    {
        return $this->request('post', '/policies/firepackage/offers/calculator', $data);
    }

    public function postOffer(array $data): array
    {
        return $this->request('post', '/policies/firepackage/offers', $data);
    }

    public function getOffers(array $data): array
    {
        return $this->request('get', '/policies/firepackage/offers', $data);
    }

    public function getOffer(int $offerId): array
    {
        return $this->request('get', '/policies/firepackage/offers/'. $offerId);
    }

    public function createPolicy(array $data): array
    {
        return $this->request('post', '/policies/firepackage/offers/confirm', $data);
    }

    public function getPolicy(int $policyId): array
    {
        return $this->request('get', '/policies/'. $policyId .'/firepackage');
    }

    public function getPolicyPDF(int $policyId): array
    {
        return $this->request('get', '/policies/'. $policyId .'/firepackage/pdf');
    }

    public function getPolicies(array $data): array
    {
        return $this->request('get', '/policies/firepackage', $data);
    }

    public function getPeriods(): array
    {
        return $this->request('get', '/datasource/months');
    }
}
