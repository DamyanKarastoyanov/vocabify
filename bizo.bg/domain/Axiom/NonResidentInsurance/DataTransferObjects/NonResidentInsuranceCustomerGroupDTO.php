<?php

namespace Domain\Axiom\NonResidentInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;

class NonResidentInsuranceCustomerGroupDTO extends Data
{
    /*
        {customerGroupId: 2, count: 2}
    */
    public function __construct(
        public int $customerGroupId,
        public int $count,
        #[DataCollectionOf(NonResidentInsuranceCustomerDTO::class)]
        public Collection $insuredCustomers,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['customerGroupId'] = $data['customerGroupId'] ?? $data['customer_group_id'];
        $data['count'] = $data['count'] ?? $data['count'];
        $data['insuredCustomers'] = $data['insuredCustomers'] ?? $data['insured_customers'] ?? [];

        return new self(
            customerGroupId: $data['customerGroupId'],
            count: $data['count'],
            insuredCustomers: collect(NonResidentInsuranceCustomerDTO::collect($data['insuredCustomers'])),
        );
    }
}
