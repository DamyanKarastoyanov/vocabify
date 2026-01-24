<?php

namespace App\Http\Web\Vehicles\Data;

class VehiclesColumnsDefinition
{
    const COLUMNS = [
        'id' => [
            'key' => 'id',
            'label' => 'Vehicle ID',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'reg_number' => [
            'key' => 'reg_number',
            'label' => 'Регистрационен номер',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
            'isExcludedFromColumnControls' => true,
            'isEnabled' => true,
            'isRequired' => true,
        ],
        'vin' => [
            'key' => 'vin',
            'label' => 'Рама',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'talon' => [
            'key' => 'talon',
            'label' => 'Талон',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
            'isEnabled' => true,
            'isRequired' => true,
        ],
        'mark' => [
            'key' => 'mark',
            'label' => 'Марка',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'model' => [
            'key' => 'model',
            'label' => 'Модел',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'manufactured_year' => [
            'key' => 'manufactured_year',
            'label' => 'Година на производство',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => false,
        ],
        'next_inspection_date' => [
            'key' => 'next_inspection_date',
            'label' => 'Следващ преглед',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => false,
        ],
        'is_valid' => [
            'key' => 'is_valid',
            'label' => 'Валиден преглед',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => false,
        ],
        'is_periodic' => [
            'key' => 'is_periodic',
            'label' => 'Периодичен преглед',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => false,
        ],
        'manage' => [
            'key' => 'manage',
            'label' => '',
            'isVisible' => true,
            'hasSortControl' => false,
            'hasFilterControl' => false,
            'isExcludedFromColumnControls' => true,
            'isExcludedFromExport' => true,
            'isSearchable' => false,
        ],
    ];

    public static function getColumns(): array
    {
        return self::COLUMNS;
    }
}

