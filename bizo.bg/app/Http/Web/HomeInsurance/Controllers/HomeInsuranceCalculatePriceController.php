<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use App\Facades\HomeInsuranceGateway;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsurancePriceCalculationDTO;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsurancePriceCalculationRequestDTO;
use Domain\Axiom\HomeInsurance\Requests\AxiomHomeInsuranceCalculatePriceRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeInsuranceCalculatePriceController
{
    public function __invoke(AxiomHomeInsuranceCalculatePriceRequest $request): JsonResource
    {
        $data = $request->validated();
        $dto = HomeInsurancePriceCalculationRequestDTO::from($data);
        $calculatedPrice = HomeInsuranceGateway::getCalculatedPrice($dto);
        $calculatedPriceDTO = HomeInsurancePriceCalculationDTO::from($calculatedPrice);

        return new JsonResource($calculatedPriceDTO);
    }
}

// fetch("http://local.bizo.bg/home-insurance/calculate-price", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
//     'Content-Type': 'application/json',
//     'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
//   },
//   "referrer": "http://local.bizo.bg/home-insurance",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"currency\":1,\"installment\":1,\"start_date\":\"2025-05-15T21:00:00.000Z\",\"period\":1,\"packages\":[{\"id\":2,\"insurance_amount\":10000},{\"id\":5,\"insurance_amount\":55000}],\"discounts\":[{\"id\":5,\"discount\":15}]}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });


