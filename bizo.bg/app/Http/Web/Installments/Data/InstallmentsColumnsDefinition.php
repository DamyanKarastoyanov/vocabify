<?php

namespace App\Http\Web\Installments\Data;

class InstallmentsColumnsDefinition
{
    const COLUMNS = [
        'id' => [
            'key' => 'id',
            'label' => 'Installment ID',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'title' => [
            'key' => 'title',
            'label' => 'Title',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
            'isExcludedFromColumnControls' => true,
        ],
        'amount' => [
            'key' => 'amount',
            'label' => 'Amount',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'status' => [
            'key' => 'status',
            'label' => 'Status',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'end_date' => [
            'key' => 'end_date',
            'label' => 'End Date',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'created_at' => [
            'key' => 'created_at',
            'label' => 'Created At',
            'isVisible' => false,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
            'isExcludedFromColumnControls' => true,
        ],
        'insurer_name' => [
            'key' => 'insurer_name',
            'label' => 'Insurer Name',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'insurance_type' => [
            'key' => 'insurance_type',
            'label' => 'Insurance Type',
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
