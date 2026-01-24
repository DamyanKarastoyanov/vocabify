<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsuranceRequiredFieldDTO extends Data
{
    /*
       {
        "type": "number",
        "label": "Шофьорски стаж",
        "required": true,
        "validation": {
            "required": true,
            "integer": true,
            "min": 1,
            "max": 70
        },
        "options_type": "input",
        "placeholder": "Въведете шофьорски стаж на застрахования (в години)"
       }
    */
    public function __construct(
        public string $type,
        public string $label,
        public bool $required,
        public array $validation = [],
        public ?string $options_type = null,
        public ?string $placeholder = null,
        public ?string $field = null,
    ) {
        //
    }
}
