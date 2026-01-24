<?php

namespace App\Http\Web\NonResidentInsurance\Controllers;

use App\Facades\NonResidentInsuranceGateway;
use Domain\Axiom\NonResidentInsurance\DataTransferObjects\NonResidentInsurancePriceCalculationDTO;
use Domain\Axiom\NonResidentInsurance\DataTransferObjects\NonResidentInsurancePriceCalculationRequestDTO;
use Domain\Axiom\NonResidentInsurance\Requests\AxiomNonResidentInsuranceCalculatePriceRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class NonResidentInsuranceCalculatePriceController
{
    public function __invoke(AxiomNonResidentInsuranceCalculatePriceRequest $request): JsonResource
    {
        $data = $request->validated();
        //dd($data);
        $dto = NonResidentInsurancePriceCalculationRequestDTO::from($data);

        //dd($dto, $dto->toArray());

        $calculatedPrice = NonResidentInsuranceGateway::getCalculatedPrice($dto);
        //dd($calculatedPrice);
        $calculatedPriceDTO = NonResidentInsurancePriceCalculationDTO::from($calculatedPrice);
        //dd($calculatedPriceDTO, $calculatedPriceDTO->toArray());

        return new JsonResource($calculatedPriceDTO);
    }
}

/*


fetch("http://local.bizo.bg/non-resident-insurance/calculate-price", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
    insuranceTypeId: 202,
    currency: 1, // original input, converted to axiom_id in the backend
    installment: 1, // original input, converted to axiom_id
    start_date: "2025-07-23T21:00:00.000Z",
    period: 1,
    discounts: [], // optional, structure stays the same
    customer_groups: [
      {
        id: 1,
        count: 1,
      }
    ]
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});

*/



