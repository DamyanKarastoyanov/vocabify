<?php

namespace Domain\Axiom\HomeInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class HomeInsurancePackageDTO extends Data
{
    /*

        {
        "propertyPackageId": 1,
        "insuranceAmount": 5000
        }

        {
            "insuranceAmount" => 5000.0
            "propertyPackageId" => 2
            "propertyPackageName" => "Стандарт"}
    */
    public function __construct(
        public int $package_id,
        public string $package_name = '',
        public float $insurance_amount,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['package_id'] = $data['package_id'] ?? $data['packageId'] ?? $data['propertyPackageId'];
        $data['package_name'] = $data['package_name'] ?? $data['propertyPackageName'] ?? '';
        $data['insurance_amount'] = $data['insurance_amount'] ?? $data['insuranceAmount'];

        return new self(
            package_id: $data['package_id'],
            package_name: $data['package_name'],
            insurance_amount: $data['insurance_amount'],
        );
    }
}
