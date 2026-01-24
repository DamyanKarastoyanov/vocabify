<?php

namespace App\Http\Web\Installments\Controllers;

use App\Http\Web\Installments\Queries\InstallmentDetailsQuery;
use App\Http\Web\Installments\Resources\InstallmentDetailsResource;
use Domain\Payment\Models\Installment;
use Domain\Payment\Requests\GetInstallmentDetailsRequest;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentDetailsController
{
    public function __invoke(GetInstallmentDetailsRequest $request, Installment $installment): JsonResource
    {
        return InstallmentDetailsResource::make((new InstallmentDetailsQuery($request, $installment))->get());
    }
}
