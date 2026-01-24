<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceOfferRequestPolicyDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsurancePersonDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceVehicleDTO;
use Domain\Broqee\MTPLInsurance\DataTransferObjects\MTPLInsuranceInsuredDTO;
use Spatie\LaravelData\Data;

class MTPLInsuranceOfferRequestDTO extends Data
{
    /*
        {
            "vehicle": {
                "number": "K1212KA",
                "talon": "012345678",
                "usage": "2",
                "engine_volume": 1234,
                "engine_power_kw": 123
            },
            "insured": {
                "xp": "11"
            },
            "policy": {
                "installments": 4,
                "start_date": "2025-09-10"
            }
        }
    */
    public function __construct(
        public MTPLInsuranceVehicleDTO $vehicle,
        public MTPLInsuranceInsuredDTO $insured,
        public MTPLInsuranceOfferRequestPolicyDTO $policy,
    ) {
        //
    }
}
