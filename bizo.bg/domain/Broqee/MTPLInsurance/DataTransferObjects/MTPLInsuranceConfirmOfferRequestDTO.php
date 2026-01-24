<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsuranceConfirmOfferRequestDTO extends Data
{
    /*
        {
            // Издаване се приема, само ако калкулацията е в същия ден. Мине ли текущия ден, задължително трябва да се направи нова калкулация, заради тарифите на застрахователите!

            "offer" : 164180,

            "data": { // тази информация е примерна, тя е видима за потребителите в Броки
                "Изпрати на": "Иван Иванов Николов", // сами си избирате key => value каквото пожелаете да подадете, за да имате информация, която желаете брокерът да вижда в Броки
                "Телефон": "0888000001",
                "Email": "ivan@domain.com",
                "Отстъпка (лв)": 0
            },
            "custom_data": { // задължителни полета, които указват на услугата какво точно желаете да издадете
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
        }
    */
    public function __construct(
        public int $offer,
        public array $data,
        public MTPLInsuranceConfirmOfferRequestCustomDataDTO $custom_data,
    ) {
        //
    }

    public function toArray(): array
    {
        return [
            'offer' => $this->offer,
            'data' => $this->data,
            'custom_data' => $this->custom_data->toArray(),
        ];
    }
}
