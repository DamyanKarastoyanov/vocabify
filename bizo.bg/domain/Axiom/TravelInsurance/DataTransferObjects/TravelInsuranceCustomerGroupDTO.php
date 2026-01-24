<?php

namespace Domain\Axiom\TravelInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;

class TravelInsuranceCustomerGroupDTO extends Data
{
    /*
        {
            "travelCustomerGroupId": 1,
            "count": 1,
            "countUnder14": 0,
            "countUnder18": 0,
            "countUnder26": 0,
            "insuranceAmount": 10000
        }
    */
    public function __construct(
        public int $travelCustomerGroupId,
        public int $count,
        public int $countUnder14,
        public int $countUnder18,
        public int $countUnder26,
        public float $insuranceAmount,
        #[DataCollectionOf(TravelInsuranceCustomerDTO::class)]
        public Collection $insuredCustomers,
    ) {
        //
    }

    public static function fromArray(array $data): static
    {
        $data['travelCustomerGroupId'] = $data['travelCustomerGroupId'] ?? $data['travel_customer_group_id'];
        $data['count'] = $data['count'] ?? $data['count'];
        $data['countUnder14'] = $data['countUnder14'] ?? $data['count_under_14'] ?? 0;
        $data['countUnder18'] = $data['countUnder18'] ?? $data['count_under_18'] ?? 0;
        $data['countUnder26'] = $data['countUnder26'] ?? $data['count_under_26'] ?? 0;
        $data['insuranceAmount'] = $data['insuranceAmount'] ?? $data['insurance_amount'];
        $data['insuredCustomers'] = $data['insuredCustomers'] ?? $data['insured_customers'] ?? [];

        return new self(
            travelCustomerGroupId: $data['travelCustomerGroupId'],
            count: $data['count'],
            countUnder14: $data['countUnder14'],
            countUnder18: $data['countUnder18'],
            countUnder26: $data['countUnder26'],
            insuranceAmount: $data['insuranceAmount'],
            insuredCustomers: collect(TravelInsuranceCustomerDTO::collect($data['insuredCustomers'])),
        );
    }
}
