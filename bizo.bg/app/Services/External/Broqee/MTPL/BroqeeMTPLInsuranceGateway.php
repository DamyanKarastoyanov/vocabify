<?php

namespace App\Services\External\Broqee\MTPL;

use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceConfirmOfferRequestDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceOfferRequestDTO;
use Illuminate\Support\Facades\Log;

class BroqeeMTPLInsuranceGateway
{
    public function __construct(
        protected BroqeeApiMTPLInsuranceClientService $broqeeApiMTPLInsuranceClientService
    ) {
        //
    }

    public function getNomenclatureList(): array
    {
        return $this->broqeeApiMTPLInsuranceClientService->getNomenclatureList();
    }

    public function getInsurersNomenclature(): array
    {
        return $this->broqeeApiMTPLInsuranceClientService->getInsurersNomenclature()['data']['insurers'];
    }

    public function getVehicleUsagesNomenclature(): array
    {
        return $this->broqeeApiMTPLInsuranceClientService->getVehicleUsagesNomenclature()['data']['vehicle_usages'];
    }

    public function getLocationsNomenclature(): array
    {
        return $this->broqeeApiMTPLInsuranceClientService->getLocationsNomenclature()['data']['locations'];
    }

    public function getVehicle(string $number, string $talon): array
    {
        $response = $this->broqeeApiMTPLInsuranceClientService->getVehicle($number, $talon)['data'];
        return [
            'vehicle' => $response['vehicle'],
            'required_fields' => $response['required_fields'] ?? [],
        ];
    }

    public function getPerson(string $number, string $talon): array
    {
        $response = $this->broqeeApiMTPLInsuranceClientService->getPerson($number, $talon)['data'];
        return [
            'person' => $response['person'],
            'required_fields' => $response['required_fields'] ?? [],
        ];
    }

    public function calculateMTPL(MTPLInsuranceOfferRequestDTO $dto): int
    {
        return $this->broqeeApiMTPLInsuranceClientService->calculateMTPL($dto->toArray())['data']['calculation'];
    }

    public function checkCalculation(int $calculation_id): array
    {
        return $this->broqeeApiMTPLInsuranceClientService->getOffer($calculation_id)['data'];
    }

    public function chooseInsurer(int $offer_id): array
    {
        return $this->broqeeApiMTPLInsuranceClientService->chooseInsurer($offer_id)['data']['required_fields'];
    }

    public function confirmOffer(MTPLInsuranceConfirmOfferRequestDTO $dto): int
    {
        return $this->broqeeApiMTPLInsuranceClientService->confirmOffer($dto->toArray())['data']['order'];
    }

    public function issuePolicy(int $order_id): array
    {
        return $this->broqeeApiMTPLInsuranceClientService->issuePolicy($order_id);
    }
}
