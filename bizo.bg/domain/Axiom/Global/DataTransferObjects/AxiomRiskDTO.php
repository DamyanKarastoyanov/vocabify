<?php

namespace Domain\Axiom\Global\DataTransferObjects;

use Spatie\LaravelData\Data;

class AxiomRiskDTO extends Data
{
      /*
        [▼
            "code" => "Клауза_А"
            "shortCode" => "A"
            "name" => "Пожар и последиците от гасенето му, мълния, експлозия и др."
            "isRequired" => true
            "isCustomizable" => true
            "isApplicableToObject" => true
            "checked" => false
            "limit" => 100.0
            "limitTypeId" => 1
            "limitTypeName" => "%"
            "previousLevelUsed" => false
            "insuranceTypeId" => 805
            "id" => 1
            "createdDate" => "2025-05-14"
            "createdByUserId" => null
            "createdByName" => ""
            "updatedDate" => "2025-05-14"
            "updatedByUserId" => null
            "updatedByName" => ""
        ]
       */
    public function __construct(
        public string $code,
        public string $shortCode,
        public string $name,
        //public bool $isRequired,
        //public bool $isCustomizable,
        //public bool $isApplicableToObject,
        //public bool $checked,
        //public float $limit,
        //public int $limitTypeId,
        //public string $limitTypeName,
        //public bool $previousLevelUsed,
        //public int $insuranceTypeId,
        public int $id,
        //public string $createdDate,
        //public ?int $createdByUserId,
        //public string $createdByName,
        //public string $updatedDate,
        //public ?int $updatedByUserId,
        //public string $updatedByName,
    ) {
        //
    }
}
