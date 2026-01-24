<?php

namespace App\Http\Web\Addresses\Queries;

use Domain\Users\Models\Address;
use Illuminate\Http\Request;

class AddressDetailsQuery
{
    protected bool $isNewAddress;

    protected array $fields = [
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
        protected Address $address,
    ) {
        $this->isNewAddress = ! $this->address->id;
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        if (! $this->isNewAddress) {
            $selectedValues = (new AddressDetailsSelectedValuesQuery($this->request, $this->address))->get();
        } else {
            $selectedValues = [];
        }

        $fieldsAbility = [];

        $fieldsVisibility = [];

        $availableValues = (new AddressDetailsValidFieldValuesQuery($this->request, $this->address))->get();

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
