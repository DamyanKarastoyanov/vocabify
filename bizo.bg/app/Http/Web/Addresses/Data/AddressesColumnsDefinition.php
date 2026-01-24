<?php

namespace App\Http\Web\Addresses\Data;

class AddressesColumnsDefinition
{
    const COLUMNS = [
        'id' => [
            'key' => 'id',
            'label' => 'Address ID',
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
            'isExcludedFromColumnControls' => true,
        ],
        'district' => [
            'key' => 'district',
            'label' => 'District',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'municipality' => [
            'key' => 'municipality',
            'label' => 'Municipality',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'town' => [
            'key' => 'town',
            'label' => 'Town',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'postal_code' => [
            'key' => 'postal_code',
            'label' => 'Postal Code',
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
