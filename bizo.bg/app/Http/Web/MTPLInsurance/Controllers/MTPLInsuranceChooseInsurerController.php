<?php

namespace App\Http\Web\MTPLInsurance\Controllers;

use App\Facades\MTPLInsuranceGateway;
use Domain\Broqee\MTPLInsurance\Requests\BroqeeMTPLInsuranceChooseInsurerRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class MTPLInsuranceChooseInsurerController
{
    public function __invoke(BroqeeMTPLInsuranceChooseInsurerRequest $request): JsonResource
    {
        $data = $request->validated();
        $offerId = $data['offer'];
        $requiredFields = MTPLInsuranceGateway::chooseInsurer($offerId);

        return new JsonResource($requiredFields);
    }
}
/*
    fetch("http://local.bizo.bg/mtpl-insurance/choose-insurer", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        "referrer": "http://local.bizo.bg/home-insurance",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
            offer_id: 164235,
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
*/


