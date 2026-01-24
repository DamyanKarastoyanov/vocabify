<?php

namespace App\Http\Web\TravelInsurance\Controllers;

use App\Facades\TravelInsuranceGateway;
use Domain\Axiom\TravelInsurance\DataTransferObjects\TravelInsurancePriceCalculationDTO;
use Domain\Axiom\TravelInsurance\DataTransferObjects\TravelInsurancePriceCalculationRequestDTO;
use Domain\Axiom\TravelInsurance\Requests\AxiomTravelInsuranceCalculatePriceRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class TravelInsuranceCalculatePriceController
{
    public function __invoke(AxiomTravelInsuranceCalculatePriceRequest $request): JsonResource
    {
        $data = $request->validated();
        $dto = TravelInsurancePriceCalculationRequestDTO::from($data);

        //dd($dto, $dto->toArray());
        
        $calculatedPrice = TravelInsuranceGateway::getCalculatedPrice($dto);
        //dd($calculatedPrice);
        $calculatedPriceDTO = TravelInsurancePriceCalculationDTO::from($calculatedPrice);
        //dd($calculatedPriceDTO, $calculatedPriceDTO->toArray());

        return new JsonResource($calculatedPriceDTO);
    }
}

/*


fetch("http://local.bizo.bg/travel-insurance/calculate-price", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
    insuranceTypeId: 209,
    currency: 2, // original input, converted to axiom_id in the backend
    installment: 1, // original input, converted to axiom_id
    start_date: "2025-07-01T21:00:00.000Z",
    end_date: "2025-07-02T21:00:00.000Z",
    travel_type: 1,
    travel_type_activity: null,
    destination: 1,
    additional_coverages: [
      {
        id: 1,
        name: "Смърт вследствие злополука",
        insurance_amount: 4
      }
    ],
    discounts: [], // optional, structure stays the same
    is_multi_travel: false,
    max_days_per_travel: 0,
    customer_groups: [
      {
        id: 1,
        count: 1,
        count_under_14: 0,
        count_under_18: 0,
        count_under_26: 0,
        insurance_amount: 4
      },
      {
        id: 2,
        count: 2,
        count_under_14: 0,
        count_under_18: 0,
        count_under_26: 0,
        insurance_amount: 4
      }
    ]
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});

*/



