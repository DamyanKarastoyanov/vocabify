<?php

namespace App\Http\Web\VehicleInspection\Queries;

use Illuminate\Http\Request;

class VehicleInspectionQuery
{
    protected array $fields = [
        ['label' => 'Автомобил', 'key' => 'vehicle', 'required' => true],
        ['label' => 'Регистрационен номер', 'key' => 'registration_number', 'required' => true],
        ['label' => 'Код от captcha', 'key' => 'captcha_code', 'required' => true],
    ];

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $selectedValues = (new VehicleInspectionSelectedValuesQuery($this->request))->get();

        $fieldsAbility = (new VehicleInspectionFieldsAbilityQuery($this->request))->get();
        $fieldsVisibility = (new VehicleInspectionFieldsVisibilityQuery($this->request))->get();

        $availableValues = (new VehicleInspectionValidFieldValuesQuery($this->request))->get();

        $res = [];
        $res['fields'] = array_map(function ($field) use ($selectedValues, $availableValues, $fieldsAbility, $fieldsVisibility) {
            $fieldData = [
                'label' => $field['label'],
                'key' => $field['key'],
                'values' => $availableValues[$field['key']] ?? [],
                'selected' => $selectedValues[$field['key']] ?? null,
                'isEnabled' => $fieldsAbility[$field['key']] ?? true,
                'isVisible' => $fieldsVisibility[$field['key']] ?? true,
                'isRequired' => $field['required'] ?? false,
                'placeholder' => $field['placeholder'] ?? null,
            ];

            return $fieldData;
        }, $this->fields);

        return $res;
    }
}

