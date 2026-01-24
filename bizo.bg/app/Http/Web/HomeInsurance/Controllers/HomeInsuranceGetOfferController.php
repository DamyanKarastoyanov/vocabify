<?php

namespace App\Http\Web\HomeInsurance\Controllers;

use App\Exceptions\ApiValidationException;
use App\Facades\HomeInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomCustomerType;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\HomeInsurance\Actions\CreateHomeInsuranceOfferAction;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsuranceOfferDTO;
use Domain\Axiom\HomeInsurance\DataTransferObjects\HomeInsuranceOfferRequestDTO;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsuranceOffer;
use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePolicy;
use Domain\Axiom\HomeInsurance\Requests\AxiomHomeInsuranceGetOfferRequest;
use Domain\Insurance\Actions\CreatePolicyAction;
use Domain\Insurance\Models\InsuranceCompany;
use Domain\Insurance\Models\InsuranceType;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Actions\CreateInstallmentAction;
use Domain\Users\Actions\CreateAddressAction;
use Domain\Users\Actions\CreatePersonAction;
use Domain\Users\Actions\CreatePropertyAction;
use Domain\Users\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class HomeInsuranceGetOfferController
{
    protected CreatePropertyAction $createPropertyAction;
    protected CreatePersonAction $createPersonAction;
    protected CreateAddressAction $createAddressAction;

    public function __invoke(
        AxiomHomeInsuranceGetOfferRequest $request,
        CreateHomeInsuranceOfferAction $createHomeInsuranceOfferAction,
        CreatePropertyAction $createPropertyAction,
        CreatePersonAction $createPersonAction,
        CreateAddressAction $createAddressAction,
        CreatePolicyAction $createPolicyAction,
        CreateInstallmentAction $createInstallmentAction
    ): JsonResource|JsonResponse
    {
        $this->createPropertyAction = $createPropertyAction;
        $this->createPersonAction = $createPersonAction;
        $this->createAddressAction = $createAddressAction;
        $data = $request->validated();

        $dto = HomeInsuranceOfferRequestDTO::from($data);

        try {
            $offer = HomeInsuranceGateway::postOffer($dto);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        }

        $offerDTO = HomeInsuranceOfferDTO::from($offer);

        $mainCustomer = $dto->customers->firstWhere('customer_type_id', AxiomCustomerType::MAIN_CUSTOMER_TYPE_ID);
        $location = AxiomTown::resolveLocation($mainCustomer->town_id);

        $offerModel = $createHomeInsuranceOfferAction->handle([
            'axiom_id' => $offerDTO->id,
            'email' => $mainCustomer->email,
            'amount' => $offerDTO->amount,
            'order_number' => Str::uuid()->toString(),
            'axiom_currency_id' => AxiomCurrency::where('axiom_id', $offerDTO->currency)->first()->id ?? null,
            'api_response_json' => json_encode($offer),
            'status' => AxiomHomeInsuranceOffer::STATUS['PENDING'],
            'user_data' => [
                'profile' => [
                    'first_name' => $mainCustomer->first_name,
                    'last_name' => $mainCustomer?->last_name ?? "",
                    'personal_identification_number' => $mainCustomer->personal_identification_number,
                    'personal_identification_number_type_id' => AxiomPersonalIdentificationNumberType::where('axiom_id', $mainCustomer->personal_identification_number_type)->first()->id ?? null,
                    // 'address' => [
                    //     'address' => $mainCustomer->address,
                    //     'postal_code' => $mainCustomer->post_code,
                    //     'town_id' => $location['town_id'],
                    //     'municipality_id' => $location['municipality_id'],
                    //     'district_id' => $location['district_id'],
                    // ],
                    'phone' => $mainCustomer->mobile_phone ?? $mainCustomer->phone_number,
                ],
            ]
        ])->refresh();

        $insuranceType = InsuranceType::firstWhere('code', AxiomHomeInsurancePolicy::INSURANCE_TYPE_CODE);
        $propertyLocation = AxiomTown::resolveLocation($dto->property->town_id);
        $policy = $createPolicyAction->handle([
            'insurance_type_id' => $insuranceType->id,
            'insurable_id' => $offerModel->id,
            'insurable_type' => AxiomHomeInsuranceOffer::class,
            'user_id' => User::SYSTEM_USER_ID,
            'insurance_company_id' => InsuranceCompany::AXIOM_ID,
            'axiom_currency_id' => $offerModel->axiom_currency_id,
            'total_amount' => $offerModel->amount,
            'commission' => $offerModel->amount * $insuranceType->commission_rate / 100,
            'policy_status_id' => PolicyStatus::STATUSES['DRAFT'],
            'start_date' => $dto->start_date,
            'end_date' => $dto->start_date->copy()->addMonths($dto->period)->subDay(),
            'title' => AxiomHomeInsurancePolicy::getTemporaryTitle(
                $dto->property->address,
                '',
                AxiomTown::find($propertyLocation['town_id']),
                AxiomMunicipality::find($propertyLocation['municipality_id']),
                AxiomDistrict::find($propertyLocation['district_id'])
            ),
        ]);

        $offerDTO->installments->each(function ($installment) use ($policy, $createInstallmentAction, $offerModel) {
            $createInstallmentAction->handle([
                'amount_due' => $installment->total_amount,
                'axiom_currency_id' => $offerModel->axiom_currency_id,
                'due_date' => $installment->due_date,
                'sequence' => $installment->number,
                'policy_id' => $policy->id,
            ]);
        });

        $user = User::find($offerModel->user_id);

        $address = $this->createAddressAction->handle([
            'address' => $mainCustomer->address,
            'postal_code' => $mainCustomer->post_code,
            'town_id' => $location['town_id'],
            'municipality_id' => $location['municipality_id'],
            'district_id' => $location['district_id'],
        ]);

        $user->profile->update(['address_id' => $address->id]);

        $this->_handlePropertyCreation($dto->property, $offerModel->user_id);

        $thirdPartyCustomer = $dto->customers->firstWhere('customer_type_id', AxiomCustomerType::THIRD_PARTY_CUSTOMER_TYPE_ID);

        $this->_handlePersonCreation($thirdPartyCustomer, $offerModel->user_id);

        $offerDTO->id = $offerModel->id;

        return new JsonResource($offerDTO);
    }

    protected function _handlePropertyCreation($propertyDto, $user_id): void
    {
        $location = AxiomTown::resolveLocation($propertyDto->town_id);

        $this->createPropertyAction->handle([
            'address' => [
                'address' => $propertyDto->address,
                'postal_code' => $propertyDto->post_code,
                'town_id' => $location['town_id'],
                'municipality_id' => $location['municipality_id'],
                'district_id' => $location['district_id'],
            ],
            'gross_floor_area_m2' => $propertyDto->property_size,
            'user_id' => $user_id,
        ]);
    }

    protected function _handlePersonCreation($personDto, $user_id): void
    {
        if($personDto && !$personDto->bank_id) {

            $location = AxiomTown::resolveLocation($personDto->town_id);
            $this->createPersonAction->handle([
                'user_id' => $user_id,
                'profile' => [
                    'first_name' => $personDto->first_name,
                    'last_name' => $personDto->last_name,
                    'personal_identification_number' => $personDto->personal_identification_number,
                    'personal_identification_number_type_id' => AxiomPersonalIdentificationNumberType::where('axiom_id', $personDto->personal_identification_number_type)->first()->id ?? null,
                    'address' => [
                        'address' => $personDto->address,
                        'postal_code' => $personDto->post_code,
                        'town_id' => $location['town_id'],
                        'municipality_id' => $location['municipality_id'],
                        'district_id' => $location['district_id'],
                    ],
                    'phone' => $personDto->mobile_phone,
                ]
            ]);
        }
    }
}

// fetch("http://local.bizo.bg/home-insurance/get-offer", {
//     "headers": {
//     "accept": "application/json",
//     "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
//     'Content-Type': 'application/json',
//     'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
//   },
//   "referrer": "http://local.bizo.bg/home-insurance",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"currency\":1,\"installment\":1,\"start_date\":\"2025-06-30T21:00:00.000Z\",\"period\":1,\"packages\":[{\"id\":2,\"insurance_amount\":10000},{\"id\":5,\"insurance_amount\":55000}],\"discounts\":[{\"id\":5,\"discount\":15}],\"customer\":{\"address\": \"Test\", \"first_name\": \"Test\", \"personal_identification_number\": \"8805305860\",\"personal_identification_number_type\": 1, \"post_code\": \"9000\",\"town_id\": \"538\",\"middle_name\": \"Test\",\"last_name\": \"Test\",\"mobile_phone\":\"0899999999\"}, \"property_address\": \"Test\",\"property_post_code\": \"9000\",\"property_town_id\": \"538\",\"property_size\": \"80\",\"bank\":2}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });


