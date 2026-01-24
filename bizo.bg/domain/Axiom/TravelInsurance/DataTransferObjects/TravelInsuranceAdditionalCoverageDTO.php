<?php

namespace Domain\Axiom\TravelInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class TravelInsuranceAdditionalCoverageDTO extends Data
{
    /*
        {
            "additionalCoverageId": 1,
            "name": "Смърт вследствие злополука",
            "selected": true,
            "insuranceAmount": 4000
        }
    */
    public function __construct(
        public int $additionalCoverageId,
        public string $name,
        public bool $selected = true,
        public float $insuranceAmount,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['additionalCoverageId'] = $data['additionalCoverageId'] ?? $data['additional_coverage_id'];
        $data['name'] = $data['name'] ?? '';
        $data['selected'] = $data['selected'] ?? true;
        $data['insuranceAmount'] = $data['insuranceAmount'] ?? $data['insurance_amount'];

        return new self(
            additionalCoverageId: $data['additionalCoverageId'],
            name: $data['name'],
            selected: $data['selected'],
            insuranceAmount: $data['insuranceAmount'],
        );
    }
}
