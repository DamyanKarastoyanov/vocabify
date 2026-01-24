<?php

namespace App\Http\Web\NonResidentInsurance\Controllers;

use App\Exceptions\ApiValidationException;
use App\Facades\NonResidentInsuranceGateway;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomTown;
use Domain\Axiom\NonResidentInsurance\Actions\CreateNonResidentInsuranceOfferAction;
use Domain\Axiom\NonResidentInsurance\DataTransferObjects\NonResidentInsuranceOfferDTO;
use Domain\Axiom\NonResidentInsurance\DataTransferObjects\NonResidentInsuranceOfferRequestDTO;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceOffer;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePolicy;
use Domain\Axiom\NonResidentInsurance\Requests\AxiomNonResidentInsuranceGetOfferRequest;
use Domain\Insurance\Actions\CreatePolicyAction;
use Domain\Insurance\Models\InsuranceCompany;
use Domain\Insurance\Models\InsuranceType;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Actions\CreateInstallmentAction;
use Domain\Users\Actions\CreateAddressAction;
use Domain\Users\Actions\CreatePersonAction;
use Domain\Users\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class NonResidentInsuranceGetOfferController
{
    protected CreatePersonAction $createPersonAction;
    protected CreateAddressAction $createAddressAction;

    public function __invoke(
        AxiomNonResidentInsuranceGetOfferRequest $request,
        CreateNonResidentInsuranceOfferAction $createNonResidentInsuranceOfferAction,
        CreatePersonAction $createPersonAction,
        CreateAddressAction $createAddressAction,
        CreatePolicyAction $createPolicyAction,
        CreateInstallmentAction $createInstallmentAction
    ): JsonResource|JsonResponse
    {
        $this->createPersonAction = $createPersonAction;
        $this->createAddressAction = $createAddressAction;
        $data = $request->validated();

        $dto = NonResidentInsuranceOfferRequestDTO::from($data);

        try {
            $offer = NonResidentInsuranceGateway::postOffer($dto);
        } catch (ApiValidationException $e) {
            return response()->json($e->getFormattedErrors(), 422);
        }

        $offerDTO = NonResidentInsuranceOfferDTO::from($offer);

        $mainCustomer = $dto->insurer;

        $offerModel = $createNonResidentInsuranceOfferAction->handle([
            'axiom_id' => $offerDTO->id,
            'email' => $mainCustomer->email,
            'amount' => $offerDTO->amount,
            'order_number' => Str::uuid()->toString(),
            'axiom_currency_id' => AxiomCurrency::where('axiom_id', $offerDTO->currency)->first()->id ?? null,
            'api_response_json' => json_encode($offer),
            'status' => AxiomNonResidentInsuranceOffer::STATUS['PENDING'],
            'user_data' => [
                'profile' => [
                    'first_name' => $mainCustomer->firstName,
                    'last_name' => $mainCustomer->lastName,
                    'personal_identification_number' => $mainCustomer->pin,
                    'personal_identification_number_type_id' => AxiomPersonalIdentificationNumberType::where('axiom_id', $mainCustomer->pinType)->first()->id ?? null,
                    'phone' => $mainCustomer->mobilePhone,
                ],
            ]
        ])->refresh();

        $insuranceType = InsuranceType::firstWhere('code', AxiomNonResidentInsurancePolicy::INSURANCE_TYPE_CODE);
        $policy = $createPolicyAction->handle([
            'insurance_type_id' => $insuranceType->id,
            'insurable_id' => $offerModel->id,
            'insurable_type' => AxiomNonResidentInsuranceOffer::class,
            'user_id' => User::SYSTEM_USER_ID,
            'insurance_company_id' => InsuranceCompany::AXIOM_ID,
            'axiom_currency_id' => $offerModel->axiom_currency_id,
            'total_amount' => $offerModel->amount,
            'commission' => $offerModel->amount * $insuranceType->commission_rate / 100,
            'policy_status_id' => PolicyStatus::STATUSES['DRAFT'],
            'start_date' => Carbon::parse($dto->beginDate),
            'end_date' => Carbon::parse($dto->beginDate)->addMonths($dto->period)->subDay(),
            'title' => AxiomNonResidentInsurancePolicy::getTemporaryTitle(
                $dto->insurer->firstName,
                $dto->insurer->lastName,
                $dto->customerGroups->sum(fn($group) => $group->count)
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
        $location = AxiomTown::resolveLocation($mainCustomer->townId);

        $address = $this->createAddressAction->handle([
            'address' => $mainCustomer->address,
            'postal_code' => $mainCustomer->postCode,
            'town_id' => $location['town_id'],
            'municipality_id' => $location['municipality_id'],
            'district_id' => $location['district_id'],
        ]);

        $user->profile->update(['address_id' => $address->id]);

        $dto->customerGroups->each(function ($group) use ($offerModel) {
            $group->insuredCustomers->each(function ($customer) use ($offerModel) {
                $this->_handlePersonCreation($customer, $offerModel->user_id);
            });
        });

        $offerDTO->id = $offerModel->id;

        return new JsonResource($offerDTO);
    }

    protected function _handlePersonCreation($personDto, $user_id): void
    {
        $this->createPersonAction->handle([
            'user_id' => $user_id,
            'profile' => [
                'first_name' => $personDto->firstName,
                'last_name' => $personDto->lastName,
                'latin_full_name' => $personDto->latinFullName,
                'personal_identification_number' => $personDto->pin,
                'personal_identification_number_type_id' => AxiomPersonalIdentificationNumberType::where('axiom_id', $personDto->pinType)->first()->id ?? null,
                'country_id' => $personDto->countryId,
                'phone' => $personDto->mobilePhone,
                'birth_date' => $personDto->birthDate ? Carbon::parse($personDto->birthDate)->format('Y-m-d H:i:s') : null,
            ]
        ]);
    }
}

/*


fetch("http://local.bizo.bg/non-resident-insurance/get-offer", {
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
    period: 1,
    start_date: "2025-09-23T21:00:00.000Z",
    discounts: [], // optional, structure stays the same
    customer_groups: [
      {
        id: 1,
        count: 1,
        insured_customers: [
          {
            id: 1,
            pin_type: 3, // Assuming this is the ID for the pin type
            pin: "382560124",
            first_name: "John",
            last_name: "Doe",
            latin_full_name: "John Doe",
            district_id: 22, // Assuming this is the ID for the district
            municipality_id: 201, // Assuming this is the ID for the municipality
            town_id: 379, // Assuming this is the ID for the town
            country_id: 6, // Assuming this is the ID for the country
            address: "123 Main St",
            mobile_phone: "+359883314542",
            post_code: "1000",
            birth_date: '1967-08-08',
          }
        ]
      }
    ],
    insurer: {
        pin_type: 1, // Assuming this is the ID for the pin type
        pin: "8805305860",
        first_name: "John",
        last_name: "Doe",
        latin_full_name: "John Doe",
        district_id: 22, // Assuming this is the ID for the district
        municipality_id: 201, // Assuming this is the ID for the municipality
        town_id: 379, // Assuming this is the ID for the town
        address: "123 Main St",
        mobile_phone: "+359883314542",
        post_code: "1000",
        email: 'puppy.eyes@bizo.bg'
    }
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});


*/



