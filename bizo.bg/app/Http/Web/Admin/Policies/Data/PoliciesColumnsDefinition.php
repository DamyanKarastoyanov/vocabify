<?php

namespace App\Http\Web\Admin\Policies\Data;

class PoliciesColumnsDefinition
{
    const COLUMNS = [
        'id' => [
            'key' => 'id',
            'label' => 'Идентификатор',
            'isVisible' => false,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
            'isExcludedFromColumnControls' => false,
        ],
        'policy_number' => [
            'key' => 'policy_number',
            'label' => 'Номер',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'title' => [
            'key' => 'title',
            'label' => 'Заглавие',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'user' => [
            'key' => 'user',
            'label' => 'Потребител',
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
        'policy_status' => [
            'key' => 'policy_status',
            'label' => 'Статус',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'policy_internal_status' => [
            'key' => 'policy_internal_status',
            'label' => 'Статус в Бизо',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'start_date' => [
            'key' => 'start_date',
            'label' => 'Валидна от',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'end_date' => [
            'key' => 'end_date',
            'label' => 'Валидна до',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'payment_progress' => [
            'key' => 'payment_progress',
            'label' => 'Прогрес на плащането',
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
        'commission' => [
            'key' => 'commission',
            'label' => 'Комисионна',
            'isVisible' => true,
            'hasSortControl' => true,
            'hasFilterControl' => true,
            'isSearchable' => true,
        ],
        'insurer' => [
            'key' => 'insurer',
            'label' => 'Застраховател',
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
