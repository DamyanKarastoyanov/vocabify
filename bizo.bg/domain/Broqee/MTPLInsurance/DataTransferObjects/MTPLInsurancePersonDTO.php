<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsurancePersonDTO extends Data
{
    /*
       {
         'xp': 11
        }
    */
    public function __construct(
        public int $xp = 0,
        public string $email = '',
        public string $phone = '',
        public string $full_name = '',
        public ?string $birth_date = null,
        public ?int $location_id = null,
        public ?string $address = null,
        public ?string $nationality = null,
    ) {
        //
    }
}
