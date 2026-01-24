<?php

namespace Domain\Broqee\MTPLInsurance\DataTransferObjects;

use Spatie\LaravelData\Data;

class MTPLInsuranceVehicleDTO extends Data
{
    /*
       {
        "number": "CA5688AA",
        "vin": "**X045691",
        "model_name": "CADDY",
        "mark_name": "VOLKSWAGEN",
        "engine_volume": "1395",
        "engine_power_kw": 5,
        "year": "2017-12-10"
        }
    */
    public function __construct(
        public string $number = '',
        public string $talon = '',
        public ?int $usage = 1,
        public string $vin = '',
        public string $model_name = '',
        public string $mark_name = '',
        public ?int $engine_volume = null,
        public ?int $engine_power_kw = null,
        //new fields
        public ?string $body_type_name = null,
        public ?string $fuel_type_id = null,
        public ?int $gross_weight = null,
        public ?int $net_weight = null,
        public ?int $weight_g = null,
        public ?int $places = null,
        public string $year = '',
        public ?int $broqee_vehicle_type_id = null,
        public ?int $wheel_direction = null,
    ) {
        //
    }

    /**
     * Custom from method to preserve all fields including undefined ones
     */
    public static function from(mixed ...$payloads): static
    {
        // Use parent's from() to handle known properties
        $data = parent::from(...$payloads);
        
        // Extract all input data
        $input = $payloads[0] ?? [];
        if (!is_array($input)) {
            return $data;
        }

        // Known property names
        $knownProperties = [
            'number', 'talon', 'usage', 'vin', 'model_name', 'mark_name',
            'engine_volume', 'engine_power_kw', 'body_type_name', 'fuel_type_id',
            'gross_weight', 'net_weight', 'weight_g', 'places', 'year',
            'broqee_vehicle_type_id', 'wheel_direction'
        ];

        // Store additional fields as dynamic properties
        foreach ($input as $key => $value) {
            if (!in_array($key, $knownProperties) && $value !== null) {
                $data->{$key} = $value;
            }
        }

        return $data;
    }
}
