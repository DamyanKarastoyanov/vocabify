<?php

namespace App\Services\External\Axiom\Travel;

use App\Exceptions\ApiLogicalException;
use App\Services\External\Axiom\AxiomApiClientService;
use App\Services\External\Axiom\AxiomInsuranceBaseGateway;
use Domain\Axiom\Global\Models\AxiomAgent;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomOffice;
use Domain\Axiom\Global\Models\AxiomOfficeRegion;
use Domain\Axiom\TravelInsurance\DataTransferObjects\TravelInsuranceOfferRequestDTO;
use Domain\Axiom\TravelInsurance\DataTransferObjects\TravelInsurancePriceCalculationRequestDTO;
use Illuminate\Support\Facades\Log;

class AxiomTravelInsuranceGateway extends AxiomInsuranceBaseGateway
{
    public function __construct(
        protected AxiomApiClientService $axiomApiClientService,
        protected AxiomApiTravelInsuranceClientService $axiomApiTravelInsuranceClientService
    ) {
        //
    }

    protected function getClientService(): AxiomApiTravelInsuranceClientService
    {
        return $this->axiomApiTravelInsuranceClientService;
    }

    protected function getInsuranceTypeId(): int
    {
        return AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID;
    }

    protected function getLogPrefix(): string
    {
        return 'Axiom Travel Insurance';
    }

    public function getTerritorialCoverage(?int $insuranceTypeId): array
    {
        return $this->axiomApiTravelInsuranceClientService->getTerritorialCoverage($insuranceTypeId);
    }

    public function getDayTypes(int $insuranceTypeId): array
    {
        return $this->axiomApiTravelInsuranceClientService->getDayTypes($insuranceTypeId);
    }

    public function getTravelTypes(?int $insuranceTypeId): array
    {
        return $this->axiomApiTravelInsuranceClientService->getTravelTypes($insuranceTypeId);
    }

    public function getInsuranceAmounts(int $insuranceTypeId, int $travelType): array
    {
        return $this->axiomApiTravelInsuranceClientService->getInsuranceAmounts($insuranceTypeId, $travelType);
    }

    public function getCalculatedPrice(TravelInsurancePriceCalculationRequestDTO $dto): array
    {
        return $this->axiomApiTravelInsuranceClientService->getCalculatedPrice($dto->toArray());
    }

    public function postOffer(TravelInsuranceOfferRequestDTO $dto): array
    {
        Log::info('Axiom Travel Insurance Offer Request Data', $dto->toArray());
        $offerResult = $this->axiomApiTravelInsuranceClientService->postOffer($dto->toArray());
        Log::info('Axiom Travel Insurance Offer Result', $offerResult);

        $offerResult['id'] = $this->getOfferIdByRequestId($offerResult['messageId']);

        return $offerResult;
    }

    public function getOffers(array $data): array
    {
        return $this->axiomApiTravelInsuranceClientService->getOffers($data);
    }

    public function getOffer(int $offerId): array
    {
        return $this->axiomApiTravelInsuranceClientService->getOffer($offerId);
    }

    public function createPolicy(int $offerId): array
    {
        $axiomData = [
            'offerId' => $offerId,
            'officeRegionId' => AxiomOfficeRegion::DEFAULT_OFFICE_REGION_ID,
            'officeId' => AxiomOffice::DEFAULT_OFFICE_ID,
            'agentId' => AxiomAgent::DEFAULT_AGENT_ID,
            'insuranceTypeId' => AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID,
        ];
        
        Log::info('Axiom Travel Insurance Create Policy Request Data', $axiomData);
        
        $policyResult = $this->axiomApiTravelInsuranceClientService->createPolicy($axiomData);

        Log::info('Axiom Travel Insurance Create Policy Result', $policyResult);

        //$offerId = 1348; // DEBUG! 1348
        $policyResult['id'] = $this->getPolicyIdByAxiomOfferId($offerId);

        return $this->getPolicy($policyResult['id']);
    }

    public function getPolicy(int $policyId): array
    {
        return $this->axiomApiTravelInsuranceClientService->getPolicy($policyId)['policy'];
    }

    public function getPolicyPDF(int $policyId): array
    {
        return $this->axiomApiTravelInsuranceClientService->getPolicyPDF($policyId)['file'];
    }

    public function getPolicies(array $data): array
    {
        return $this->axiomApiTravelInsuranceClientService->getPolicies($data);
    }
}
