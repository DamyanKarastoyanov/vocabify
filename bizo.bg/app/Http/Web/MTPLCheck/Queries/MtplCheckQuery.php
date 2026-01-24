<?php

namespace App\Http\Web\MTPLCheck\Queries;

use Illuminate\Http\Request;

class MtplCheckQuery
{
    protected array $fields = [
        ['label' => 'Автомобил', 'key' => 'vehicle', 'required' => false],
        ['label' => 'Регистрационен номер', 'key' => 'registration_number', 'required' => true],
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
        $selectedValues = (new MtplCheckSelectedValuesQuery($this->request))->get();

        $fieldsAbility = (new MtplCheckFieldsAbilityQuery($this->request))->get();
        $fieldsVisibility = (new MtplCheckFieldsVisibilityQuery($this->request))->get();

        $availableValues = (new MtplCheckValidFieldValuesQuery($this->request))->get();

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

