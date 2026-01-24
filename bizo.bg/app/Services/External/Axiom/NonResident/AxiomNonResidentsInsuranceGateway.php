<?php

namespace App\Services\External\Axiom\NonResident;

use App\Services\External\Axiom\AxiomApiClientService;
use App\Services\External\Axiom\AxiomInsuranceBaseGateway;
use Domain\Axiom\Global\Models\AxiomAgent;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomOffice;
use Domain\Axiom\Global\Models\AxiomOfficeRegion;
use Domain\Axiom\NonResidentInsurance\DataTransferObjects\NonResidentInsuranceOfferRequestDTO;
use Domain\Axiom\NonResidentInsurance\DataTransferObjects\NonResidentInsurancePriceCalculationRequestDTO;
use Illuminate\Support\Facades\Log;

class AxiomNonResidentsInsuranceGateway extends AxiomInsuranceBaseGateway
{
    public function __construct(
        protected AxiomApiClientService $axiomApiClientService,
        protected AxiomApiNonResidentInsuranceClientService $axiomApiNonResidentInsuranceClientService
    ) {
        //
    }

    protected function getClientService(): AxiomApiNonResidentInsuranceClientService
    {
        return $this->axiomApiNonResidentInsuranceClientService;
    }

    protected function getInsuranceTypeId(): int
    {
        return AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID;
    }

    protected function getLogPrefix(): string
    {
        return 'Axiom Non-Residents Insurance';
    }

    public function test(): string
    {
        $version = $this->axiomApiClientService->getApiVersion();
        return "Axiom Non-Residents Insurance Gateway Version: $version";
    }

    public function getTypes(): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getTypes();
    }

    public function getInsuranceTypes(): array
    {
        return $this->axiomApiClientService->getNonResidentsInsuranceTypes();
    }

    public function getCustomerGroups(): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getCustomerGroups(AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID)['foreignerCustomerGroups'];
    }

    public function getCalculatedPrice(NonResidentInsurancePriceCalculationRequestDTO $dto): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getCalculatedPrice($dto->toArray());
    }

    public function postOffer(NonResidentInsuranceOfferRequestDTO $dto): array
    {
        Log::info('Axiom Non-Residents Insurance Offer Request Data', $dto->toArray());
        $offerResult = $this->axiomApiNonResidentInsuranceClientService->postOffer($dto->toArray());
        Log::info('Axiom Non-Residents Insurance Offer Result', $offerResult);

        //$offerResult['id'] = $this->getOfferIdByRequestId($offerResult['messageId']);
        $offerResult = $this->getOffer($this->getOfferIdByRequestId($offerResult['messageId']))['offer'];

        return $offerResult;
    }

    public function getOffers(array $data): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getOffers($data);
    }

    public function createPolicy(int $offerId): array
    {
        $axiomData = [
            'offerId' => $offerId,
            'officeRegionId' => AxiomOfficeRegion::DEFAULT_OFFICE_REGION_ID,
            'officeId' => AxiomOffice::DEFAULT_OFFICE_ID,
            'agentId' => AxiomAgent::DEFAULT_AGENT_ID,
            'insuranceTypeId' => AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID,
        ];

        Log::info('Axiom Non-Residents Insurance Create Policy Request Data', $axiomData);

        $policyResult = $this->axiomApiNonResidentInsuranceClientService->createPolicy($axiomData);

        Log::info('Axiom Non-Residents Insurance Create Policy Result', $policyResult);

        //$offerId = 1297; // DEBUG! 1297
        $policyResult['id'] = $this->getPolicyIdByAxiomOfferId($offerId);


        return $this->getPolicy($policyResult['id'])['policy'];
    }

    public function getPolicies(array $data): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getPolicies($data);
    }

    public function getPolicy(int $policyId): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getPolicy($policyId);
    }

    public function getPolicyPDF(int $policyId): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getPolicyPDF($policyId)['file'];
    }

    public function getOffer(int $offerId): array
    {
        return $this->axiomApiNonResidentInsuranceClientService->getOffer($offerId);
    }

    public function getPeriods(): array
    {
        return $this->axiomApiClientService->getPeriods(AxiomInsuranceType::NON_RESIDENT_INSURANCE_TYPE_AXIOM_ID);
    }
}
