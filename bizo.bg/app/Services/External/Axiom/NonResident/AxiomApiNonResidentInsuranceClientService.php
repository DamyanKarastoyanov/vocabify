<?php

namespace App\Services\External\Axiom\NonResident;

use App\Services\External\Axiom\AxiomAbstractApiClient;

class AxiomApiNonResidentInsuranceClientService extends AxiomAbstractApiClient
{

    public function getTypes(): array
    {
        return $this->request('get', '/datasource/insurancetypes/foreigners');
    }

    public function getCustomerGroups(int $insuranceTypeId): array
    {
        return $this->request('get', '/datasource/foreigners/customergroups', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getCalculatedPrice(array $data): array
    {
        return $this->request('post', '/policies/foreigners/offers/calculator', $data);
    }

    public function postOffer(array $data): array
    {
        return $this->request('post', '/policies/foreigners/offers', $data);
    }

    public function getOffers(array $data): array
    {
        return $this->request('get', '/policies/foreigners/offers', $data);
    }

    public function getOffer(int $offerId): array
    {
        return $this->request('get', '/policies/foreigners/offers/' . $offerId);
    }

    public function createPolicy(array $data): array
    {
        return $this->request('post', '/policies/foreigners/offers/confirm', $data);
    }

    public function getPolicies(array $data): array
    {
        return $this->request('get', '/policies/foreigners', $data);
    }

    public function getPolicyPDF(int $policyId): array
    {
        return $this->request('get', '/policies/'. $policyId .'/foreigners/pdf');
    }

    public function getPolicy(int $policyId): array
    {
        return $this->request('get', '/policies/'.$policyId.'/foreigners');
    }

}
