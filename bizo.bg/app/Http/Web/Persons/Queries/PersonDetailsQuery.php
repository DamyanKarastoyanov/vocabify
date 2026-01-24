<?php

namespace App\Http\Web\Persons\Queries;

use Domain\Users\Models\Person;
use Illuminate\Http\Request;

class PersonDetailsQuery
{
    protected bool $isNewPerson;

    protected array $fields = [
        ['label' => 'Име', 'key' => 'first_name', 'required' => true],
        ['label' => 'Фамилия', 'key' => 'last_name', 'required' => true],
        ['label' => 'Име на латиница', 'key' => 'latin_full_name', 'required' => false],
        ['label' => 'Вид идентификатор', 'key' => 'personal_identification_number_type', 'required' => true],
        ['label' => 'Идентификатор на титуляра', 'key' => 'personal_identification_number', 'required' => true],
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
        protected Person $person,
    ) {
        $this->isNewPerson = ! $this->person->id;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        if (! $this->isNewPerson) {
            $selectedValues = (new PersonDetailsSelectedValuesQuery($this->request, $this->person))->get();
        } else {
            $selectedValues = [];
        }

        $fieldsAbility = [];

        $fieldsVisibility = [];

        $availableValues = (new PersonDetailsValidFieldValuesQuery($this->request, $this->person))->get();

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
