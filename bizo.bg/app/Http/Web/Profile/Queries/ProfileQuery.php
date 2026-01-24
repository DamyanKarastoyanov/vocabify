<?php

namespace App\Http\Web\Profile\Queries;

use Domain\Users\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileQuery
{
    protected array $fields = [
        ['label' => 'Имейл', 'key' => 'email', 'required' => true],
        ['label' => 'Име', 'key' => 'profile_first_name', 'required' => true],
        ['label' => 'Фамилия', 'key' => 'profile_last_name', 'required' => true],
        ['label' => 'Име на латиница', 'key' => 'profile_latin_full_name'],
        ['label' => 'Рождена дата', 'key' => 'profile_birth_date'],
        ['label' => 'Вид идентификатор', 'key' => 'profile_personal_identification_number_type'],
        ['label' => 'Идентификатор на титуляра', 'key' => 'profile_personal_identification_number'],
        ['label' => 'Телефон', 'key' => 'profile_phone'],
        ['label' => 'Номер на шофьорска книжка', 'key' => 'profile_driver_license'],
        ['label' => 'Област', 'key' => 'address_district'],
        ['label' => 'Община', 'key' => 'address_municipality'],
        ['label' => 'Населено място', 'key' => 'address_town'],
        ['label' => 'Пощенски код', 'key' => 'address_postcode'],
        ['label' => 'Адрес', 'key' => 'address_address'],
        ['label' => 'Текуща парола', 'key' => 'current_password', 'type' => 'password', 'required' => true],
        ['label' => 'Нова парола', 'key' => 'password', 'type' => 'password', 'required' => true],
        ['label' => 'Потвърди нова парола', 'key' => 'password_confirmation', 'type' => 'password', 'required' => true],
    ];

    public function __construct(protected Request $request, protected User $user)
    {
        if(!$user->id){
            $this->user = Auth::user();
        }
    }

    public function get(): array
    {
        $selectedValues = (new ProfileSelectedValuesQuery($this->request, $this->user))->get();

        $fieldsVisibility = (new ProfileFieldsVisibilityQuery($this->request))->get();

        $fieldsAbility = (new ProfileFieldsAbilityQuery($this->request, $this->user))->get();
        $availableValues = (new ProfileValidFieldValuesQuery($this->request, $this->user))->get();

        $res = [];
        $res['fields'] = array_map(function ($field) use ($selectedValues, $availableValues, $fieldsAbility, $fieldsVisibility) {
            $fieldData = [
                'label' => $field['label'],
                'key' => $field['key'],
                'type' => $field['type'] ?? null,
                'values' => $availableValues[$field['key']] ?? [],
                'selected' => $selectedValues[$field['key']] ?? null,
                'isEnabled' => $fieldsAbility[$field['key']] ?? true,
                'isVisible' => $fieldsVisibility[$field['key']] ?? false,
                'isRequired' => $field['required'] ?? false,
                'placeholder' => $field['placeholder'] ?? null,
            ];

            return $fieldData;
        }, $this->fields);

        return $res;
    }
}
