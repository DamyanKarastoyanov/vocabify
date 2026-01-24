<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class MTPLInsuranceVehiclePersonDataDTO extends Data
{
    public function __construct(
        public ?MTPLInsuranceVehicleDTO $vehicle = null,
        public ?MTPLInsurancePersonDTO $person = null,
        #[DataCollectionOf(MTPLInsuranceRequiredFieldDTO::class)]
        public Collection $required_fields,
    ) {
        //
    }
}

