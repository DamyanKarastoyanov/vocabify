<?php

namespace App\Services\External\Axiom\Home;

use App\Exceptions\ApiLogicalException;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsuranceOfferRequestDTO;
use App\Services\External\Axiom\AxiomApiClientService;
use App\Services\External\Axiom\AxiomInsuranceBaseGateway;
use Domain\Axiom\Global\Models\AxiomAgent;
use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomOffice;
use Domain\Axiom\Global\Models\AxiomOfficeRegion;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsurancePriceCalculationRequestDTO;
use Illuminate\Support\Facades\Log;

class AxiomHomeInsuranceGateway extends AxiomInsuranceBaseGateway
{
    public function __construct(
        protected AxiomApiClientService $axiomApiClientService,
        protected AxiomApiHomeInsuranceClientService $axiomApiHomeInsuranceClientService
    ) {
        //
    }

    protected function getClientService(): AxiomApiHomeInsuranceClientService
    {
        return $this->axiomApiHomeInsuranceClientService;
    }

    protected function getInsuranceTypeId(): int
    {
        return AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID;
    }

    protected function getLogPrefix(): string
    {
        return 'Axiom Home Insurance';
    }

    public function getPeriods(): array
    {
        return $this->axiomApiHomeInsuranceClientService->getPeriods();
    }

    public function getPackages(): array
    {
       return $this->axiomApiClientService->getPackages(AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID)['productPackages'];
    }

    public function getDiscounts(): array
    {
       return $this->axiomApiClientService->getDiscounts(AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID)['productDiscounts'];
    }

    public function getCalculatedPrice(HomeInsurancePriceCalculationRequestDTO $dto): array
    {
        $axiomData = [
            'insuranceTypeId' => $dto->insurance_type_id,
            'currencyCode' => $dto->currency,
            'numberOfInstallments' => $dto->installment,
            'beginDate' => $dto->start_date->toIso8601ZuluString(),
            'period' => $dto->period,
            'propertyPackages' => $dto->packages->map(function ($item) {
                return [
                    'propertyPackageId' => $item->package_id,
                    'insuranceAmount' => $item->insurance_amount,
                ];
            })->toArray(),
            'productDiscounts' => $dto->discounts->map(function ($item) {
                return [
                    'discountId' => $item->discount_id,
                    'discount' => $item->discount,
                ];
            })->toArray(),
        ];

        return $this->axiomApiHomeInsuranceClientService->getCalculatedPrice($axiomData);
    }

    public function postOffer(HomeInsuranceOfferRequestDTO $dto): array
    {
        $axiomData = [
            'officeRegionId' => AxiomOfficeRegion::DEFAULT_OFFICE_REGION_ID,
            'officeId' => AxiomOffice::DEFAULT_OFFICE_ID,
            'agentId' => AxiomAgent::DEFAULT_AGENT_ID,
            'insuranceTypeId' => AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID,
            'beginDate' => $dto->start_date->toIso8601ZuluString(),
            'period' => $dto->period,
            'numberOfInstallments' => $dto->installment,
            'currencyCode' => $dto->currency,
            'customers' => $dto->customers->map(function ($item) {
                $municipalityId = $item->municipality_id ?? AxiomTown::firstWhere('axiom_id', $item->town_id)->axiom_municipality_id;
                $districtId = $item->district_id ?? AxiomMunicipality::firstWhere('axiom_id', $municipalityId)->axiom_district_id;
                $res = [
                    "address" => $item->address,
                    "firstName" => $item->first_name,
                    "pin" => $item->personal_identification_number,
                    "pinType" => $item->personal_identification_number_type,
                    "postCode" => $item->post_code,
                    "townId" => $item->town_id,
                    "municipalityId" => $municipalityId,
                    "districtId" => $districtId,
                    "customerTypeId" => $item->customer_type_id,
                    "middleName" => $item->middle_name,
                    "lastName" => $item->last_name,
                    "phoneNumber" => $item->phone_number,
                    "mobilePhone" => $item->mobile_phone,
                    "email" => $item->email,
                ];

                if($item->bank_id) {
                    $res['bankId'] = $item->bank_id;
                }

                return $res;
            })->toArray(),
            'propertyPackages' => $dto->packages->map(function ($item) {
                return [
                    'propertyPackageId' => $item->package_id,
                    'insuranceAmount' => $item->insurance_amount,
                ];
            })->toArray(),
            'productDiscounts' => $dto->discounts->map(function ($item) {
                return [
                    'discountId' => $item->discount_id,
                    'discount' => $item->discount,
                ];
            })->toArray(),
            'property' => [
                'address' => $dto->property->address,
                'postCode' => $dto->property->post_code,
                'townId' => $dto->property->town_id,
                'propertySize' => $dto->property->property_size,
            ]
        ];
        Log::info('Axiom Home Insurance Offer Request Data', $axiomData);
        $offerResult = $this->axiomApiHomeInsuranceClientService->postOffer($axiomData);
        Log::info('Axiom Home Insurance Offer Result', $offerResult);

        $offerResult['id'] = $this->getOfferIdByRequestId($offerResult['messageId']);

        return $offerResult;
    }

    /**
     * Get offers based on the provided data.
     *
     * @param array $data
     * @return array
     */

    public function getOffers(array $data): array
    {
        return $this->axiomApiHomeInsuranceClientService->getOffers($data);
    }

    public function getOffer(int $offerId): array
    {
        return $this->axiomApiHomeInsuranceClientService->getOffer($offerId);
    }

    public function createPolicy(int $offerId): array
    {
        $axiomData = [
            'offerId' => $offerId,
            'officeRegionId' => AxiomOfficeRegion::DEFAULT_OFFICE_REGION_ID,
            'officeId' => AxiomOffice::DEFAULT_OFFICE_ID,
            'agentId' => AxiomAgent::DEFAULT_AGENT_ID,
            'insuranceTypeId' => AxiomInsuranceType::HOME_INSURANCE_TYPE_AXIOM_ID,
        ];

        Log::info('Axiom Home Insurance Create Policy Request Data', $axiomData);

        $policyResult = $this->axiomApiHomeInsuranceClientService->createPolicy($axiomData);

        Log::info('Axiom Home Insurance Create Policy Result', $policyResult);

        // DEBUG: 1317
        //$offerId = 1317;
        $policyResult['id'] = $this->getPolicyIdByAxiomOfferId($offerId);

        return $this->getPolicy($policyResult['id']);
    }

    public function getPolicy(int $policyId): array
    {
        return $this->axiomApiHomeInsuranceClientService->getPolicy($policyId)['policy'];
    }

    public function getPolicyPDF(int $policyId): array
    {
        return $this->axiomApiHomeInsuranceClientService->getPolicyPDF($policyId)['file'];
    }

    public function getPolicies(array $data): array
    {
        return $this->axiomApiHomeInsuranceClientService->getPolicies($data);
    }
}
