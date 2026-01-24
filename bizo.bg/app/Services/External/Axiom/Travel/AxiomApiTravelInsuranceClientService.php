<?php

namespace App\Services\External\Axiom\Travel;

use App\Services\External\Axiom\AxiomAbstractApiClient;
use Domain\Axiom\Global\Models\AxiomInsuranceType;

class AxiomApiTravelInsuranceClientService extends AxiomAbstractApiClient
{
    public function getTerritorialCoverage(int $insuranceTypeId = AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID): array
    {
        return $this->request('get', '/datasource/territorialcoverages', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getAdditionalCoverages(int $insuranceTypeId = AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID): array
    {
        return $this->request('get', '/datasource/traveladditionalcoverages', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getDayTypes(int $insuranceTypeId): array
    {
        return $this->request('get', '/datasource/multitravel/daytypes', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getTravelCustomerGroups(int $insuranceTypeId = AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID): array
    {
        return $this->request('get', '/products/travel/customergroups', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getTravelTypes(int $insuranceTypeId = AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID): array
    {
        return $this->request('get', '/datasource/traveltypes', [
            'InsuranceTypeId' => $insuranceTypeId,
        ]);
    }

    public function getTravelTypesActivities(int $insuranceTypeId = AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID, int $travelTypeId): array
    {
        return $this->request('get', '/datasource/traveltypeactivities', [
            'InsuranceTypeId' => $insuranceTypeId,
            'TravelTypeId' => $travelTypeId,
        ]);
    }

    public function getInsuranceAmounts(int $insuranceTypeId = AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID, int $customerGroupId): array
    {
        return $this->request('get', '/datasource/insurancetypes/' . $insuranceTypeId . '/travelcustomergroups/' . $customerGroupId . '/insuranceamounts');
    }

    public function getCalculatedPrice(array $data): array
    {
        return $this->request('post', '/policies/travel/offers/calculator', $data);
    }

    public function postOffer(array $data): array
    {
        return $this->request('post', '/policies/travel/offers', $data);
    }

    public function getOffers(array $data): array
    {
        return $this->request('get', '/policies/travel/offers', $data);
    }

    public function getOffer(int $offerId): array
    {
        return $this->request('get', '/policies/travel/offers/'. $offerId);
    }

    public function createPolicy(array $data): array
    {
        return $this->request('post', '/policies/travel/offers/confirm', $data);
    }

    public function getPolicy(int $policyId): array
    {
        return $this->request('get', '/policies/'. $policyId .'/travel');
    }

    public function getPolicyPDF(int $policyId): array
    {
        return $this->request('get', '/policies/'. $policyId .'/travel/pdf');
    }

    public function getPolicies(array $data): array
    {
        return $this->request('get', '/policies/travel', $data);
    }

}
