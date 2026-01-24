<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsuranceConfirmOfferRequestCustomDataDTO extends Data
{
    /*
        { // задължителни полета, които указват на услугата какво точно желаете да издадете
                "policy_start_date": "2025-09-10",

                "order_id": 18, // уникален номер на поръчка в сайта, позволява по-лесно разпознаване след това на webhook
                "order_items_id": 18, // уникален Ваш номер на ред в поръчка в сайта, позволява по-лесно разпознаване след това на webhook

                // "discount_amount_bgn": 0, // ако сте решили да дадете отстъпка, то тя ще се запише и пресметне автоматично в Броки
                // "discount_amount_eur": 0,

                "insured_country": "Германия",

                "insured_location|primary": 4440, // от опциите на /choose
                "vehicle_usage|primary": "1", // от опциите на /choose
                "vehicle_more_than_60_days": "1", // допълнителен въпросник, задължителен само за застраховател ДЗИ
                "vehicle_provided_to_foreigners": "-1" // допълнителен въпросник, задължителен само за застраховател Булстрад
            }
    */
    public function __construct(
        public string $policy_start_date,
        public string $order_id,
        public string $order_items_id,
        public ?float $discount_amount_bgn,
        public ?float $discount_amount_eur,
        public string $insured_country = 'България',
        public ?int $insured_location_primary = null,
        public ?string $vehicle_usage_primary = null,
        public ?string $vehicle_more_than_60_days = "-1",
        public ?string $vehicle_provided_to_foreigners = "-1",
    ) {
        //
    }

    public function toArray(): array
    {
        $data = [
            'policy_start_date' => $this->policy_start_date,
            'order_id' => $this->order_id,
            'order_items_id' => $this->order_items_id,
            'discount_amount_bgn' => $this->discount_amount_bgn ?? 0,
            'discount_amount_eur' => $this->discount_amount_eur ?? 0,
            'insured_country' => $this->insured_country,
            'vehicle_more_than_60_days' => $this->vehicle_more_than_60_days,
            'vehicle_provided_to_foreigners' => $this->vehicle_provided_to_foreigners,
        ];

        if ($this->insured_location_primary !== null) {
            $data['insured_location|primary'] = $this->insured_location_primary;
        }

        if ($this->vehicle_usage_primary !== null) {
            $data['vehicle_usage|primary'] = $this->vehicle_usage_primary;
        }

        return $data;
    }
}
