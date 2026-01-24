<?php

namespace App\Http\Web\Properties\Queries;

use Domain\Users\Models\Property;
use Illuminate\Http\Request;

class PropertyDetailsQuery
{
    protected bool $isNewProperty;

    protected array $fields = [
        ['label' => 'РЗП', 'key' => 'property_size', 'required' => true],
        ['label' => 'Област', 'key' => 'district', 'required' => true],
        ['label' => 'Община', 'key' => 'municipality', 'required' => true],
        ['label' => 'Населено място', 'key' => 'town', 'required' => true],
        ['label' => 'Пощенски код', 'key' => 'postcode', 'required' => true],
        ['label' => 'Адрес', 'key' => 'address', 'required' => true],
    ];

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Property $property,
    ) {
        $this->isNewProperty = ! $this->property->id;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        if (! $this->isNewProperty) {
            $selectedValues = (new PropertyDetailsSelectedValuesQuery($this->request, $this->property))->get();
        } else {
            $selectedValues = [];
        }

        $fieldsAbility = [];

        $fieldsVisibility = [];

        $availableValues = (new PropertyDetailsValidFieldValuesQuery($this->request, $this->property))->get();

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
