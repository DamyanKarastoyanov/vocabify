<?php

namespace App\Http\Web\Persons\Data;

class PersonsColumnsDefinition
{
    const COLUMNS = [
        'id' => [
            'key' => 'id',
            'label' => 'Person ID',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'first_name' => [
            'key' => 'first_name',
            'label' => 'First Name',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'last_name' => [
            'key' => 'last_name',
            'label' => 'Last Name',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'personal_identification_number' => [
            'key' => 'personal_identification_number',
            'label' => 'PIN',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'personal_identification_number_type_name' => [
            'key' => 'personal_identification_number_type_name',
            'label' => 'PIN Type',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'address' => [
            'key' => 'address',
            'label' => 'Address',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
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
