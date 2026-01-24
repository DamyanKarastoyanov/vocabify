<?php

namespace Domain\Axiom\Global\DataTransferObjects;

use Spatie\LaravelData\Data;

class AxiomPackageDTO extends Data
{
      /*
        [▼
            "code" => "Прима"
            "name" => "Прима"
            "isCustomizable" => true
            "tariff" => 0.07
            "isRealEstate" => true
            "isActive" => true
            "insuranceAmount" => 0
            "minInsuranceAmount" => 5000.0
            "maxInsuranceAmount" => 3000000.0
            "checked" => false
            "risks" => array:7 [▶]
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
        public string $name,
        //public bool $isCustomizable,
        public float $tariff,
        public bool $isRealEstate,
        public bool $isActive,
        //public float $insuranceAmount,
        public float $minInsuranceAmount,
        public float $maxInsuranceAmount,
        //public bool $checked,
        /** @var AxiomRiskDTO[] */
        public array $risks,
        public int $insuranceTypeId,
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
