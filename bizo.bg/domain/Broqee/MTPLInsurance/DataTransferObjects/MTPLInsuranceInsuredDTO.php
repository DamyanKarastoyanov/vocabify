<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsuranceInsuredDTO extends Data
{
    /*
       {
        'xp': 11,
        'location': 'some_location',
        'nationality': 'BG',
        'address': 'Some address',
        'birth_date': '1990-01-01'
       }
    */
    public function __construct(
        public int $xp = 0,
        public ?string $location = null,
        public ?string $nationality = null,
        public ?string $address = null,
        public ?string $birth_date = null,
    ) {
        //
    }
}
