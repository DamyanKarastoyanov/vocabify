<?php

namespace App\Services\External\Axiom;

use App\Services\External\Axiom\AxiomAbstractApiClient;

class AxiomApiClientService extends AxiomAbstractApiClient
{
    public function getApiVersion(): string
    {
        return $this->request('get', '/api/version/info')['data'];
    }

    public function getNonResidentsInsuranceTypes(): array
    {
        return $this->request('get', '/datasource/insurancetypes/foreigners');
    }

    public function getInstallmentTypes(): array
    {
        return $this->request('get', '/datasource/installmenttypes');
    }

    public function getPINTypes(): array
    {
        return $this->request('get', '/datasource/pintypes');
    }

    public function getCustomerTypes(): array
    {
        return $this->request('get', '/datasource/customertypes');
    }

    public function getCurrencies(int $insuranceTypeId): array
    {
        return $this->request('get', '/datasource/currencies', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getPeriods(int $insuranceTypeId): array
    {
        return $this->request('get', '/datasource/insuranceTypes/' . $insuranceTypeId . '/foreigner/periods');
    }

    public function getDistricts(): array
    {
        return $this->request('get', '/datasource/districts/');
    }

    public function getMunicipalities(int $districtId): array
    {
        return $this->request('get', '/districts/' . $districtId . '/municipalities/');
    }

    public function getTowns(int $municipalityId): array
    {
        return $this->request('get', '/datasource/municipalities/' . $municipalityId . '/towns/');
    }

    public function getDiscounts( int $insuranceTypeId): array
    {
        return $this->request('get', '/product/discounts', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getPackages( int $insuranceTypeId): array
    {
        return $this->request('get', '/product/packages', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getAgentTypes(): array
    {
        return $this->request('get', '/datasource/agenttypes');
    }

    public function getOfficeRegions(): array
    {
        return $this->request('get', '/datasource/officeregions');
    }

    public function getOffices(int $officeRegionId): array
    {
        return $this->request('get', '/datasource/offices', [
            'OfficeRegionId' => $officeRegionId
        ]);
    }

    public function getAgents(int $agentTypeId, int $officeRegionId): array
    {
        return $this->request('get', '/datasource/agents', [
            'AgentTypeId' => $agentTypeId,
            'OfficeRegionId' => $officeRegionId
        ]);
    }

    public function getPolicyStatuses(): array
    {
        return $this->request('get', '/datasource/policystatuses');
    }

    public function getBanks(): array
    {
        return $this->request('get', '/datasource/banks');
    }

    public function getBankDetails(int $bank_id): array
    {
        return $this->request('get', '/banks/' . $bank_id)['bank'];
    }

    public function getCountries(): array
    {
        return $this->request('get', '/datasource/countries');
    }
}
