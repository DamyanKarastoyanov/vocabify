<?php

namespace App\Http\Controllers\Admin\EmailTest\Queries;

use Illuminate\Http\Request;

class EmailTestQuery
{
    protected array $fields = [
        ['label' => 'Имейл', 'key' => 'email', 'required' => true],
    ];

    public function __construct(protected Request $request)
    {
        //
    }

    public function get(): array
    {
        $selectedValues = (new EmailTestSelectedValuesQuery($this->request))->get();
        $availableValues = (new EmailTestValidFieldValuesQuery($this->request))->get();

        $fieldsAbility = [
            'email' => true,
        ];

        $fieldsVisibility = [
            'email' => true,
        ];

        $res = [];
        $res['fields'] = array_map(function ($field) use ($selectedValues, $availableValues, $fieldsAbility, $fieldsVisibility) {
            $fieldData = [
                'label' => $field['label'],
                'key' => $field['key'],
                'type' => $field['type'] ?? null,
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

