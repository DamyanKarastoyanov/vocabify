<?php

namespace App\Http\Web\MVRFinesCheck\Queries;

use Illuminate\Http\Request;

class MVRFinesCheckQuery
{
    protected array $fields = [
        ['label' => 'Профил', 'key' => 'profile', 'required' => false],
        ['label' => 'ЕГН', 'key' => 'egn', 'required' => true],
        ['label' => 'Номер на шофьорска книжка', 'key' => 'driving_licence_number', 'required' => true],
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
        $selectedValues = (new MVRFinesCheckSelectedValuesQuery($this->request))->get();

        $fieldsAbility = (new MVRFinesCheckFieldsAbilityQuery($this->request))->get();
        $fieldsVisibility = (new MVRFinesCheckFieldsVisibilityQuery($this->request))->get();

        $availableValues = (new MVRFinesCheckValidFieldValuesQuery($this->request))->get();

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
            ];

            return $fieldData;
        }, $this->fields);

        return $res;
    }
}

