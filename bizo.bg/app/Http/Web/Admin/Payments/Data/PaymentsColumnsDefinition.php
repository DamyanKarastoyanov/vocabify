<?php

namespace App\Http\Web\Admin\Payments\Data;

class PaymentsColumnsDefinition
{
    const COLUMNS = [
        'id' => [
            'key' => 'id',
            'label' => 'Номер',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
            'isExcludedFromColumnControls' => true,
        ],
        'date_time' => [
            'key' => 'date_time',
            'label' => 'Дата на плащане',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'user_name' => [
            'key' => 'user_name',
            'label' => 'Потребител',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'policy' => [
            'key' => 'policy',
            'label' => 'Полица',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'payment_reference' => [
            'key' => 'payment_reference',
            'label' => 'Основание за плащане',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'insurance_type' => [
            'key' => 'insurance_type',
            'label' => 'Тип застраховка',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'amount' => [
            'key' => 'amount',
            'label' => 'Сума',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'payment_method' => [
            'key' => 'payment_method',
            'label' => 'Метод на плащане',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'status' => [
            'key' => 'status',
            'label' => 'Статус',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'verified_by' => [
            'key' => 'verified_by',
            'label' => 'Проверено от',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'verified_at' => [
            'key' => 'verified_at',
            'label' => 'Проверено на',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'reference_number' => [
            'key' => 'reference_number',
            'label' => 'Номер на транзакция',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'notes' => [
            'key' => 'notes',
            'label' => 'Бележки',
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
