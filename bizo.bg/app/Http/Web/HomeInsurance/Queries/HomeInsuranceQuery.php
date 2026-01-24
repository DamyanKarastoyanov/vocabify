<?php

namespace App\Http\Web\HomeInsurance\Queries;

use Illuminate\Http\Request;
use App\Http\Web\HomeInsurance\Queries\HomeInsuranceFieldsVisibilityQuery;

class HomeInsuranceQuery
{
    protected array $fields = [
        ['label' => 'Имот', 'key' => 'property', 'required' => false],
        ['label' => 'Област', 'key' => 'district', 'required' => true],
        ['label' => 'Община', 'key' => 'municipality', 'required' => true],
        ['label' => 'Населено място', 'key' => 'town', 'required' => true],
        ['label' => 'Пощенски код', 'key' => 'postcode', 'required' => true],
        ['label' => 'Адрес', 'key' => 'property_address', 'required' => true],
        ['label' => 'РЗП', 'key' => 'property_size', 'required' => true],
        ['label' => 'Начална дата', 'key' => 'start_date', 'required' => true],
        ['label' => 'Срок на застраховката', 'key' => 'period', 'required' => true],
        ['label' => 'Валута', 'key' => 'currency', 'required' => true],
        ['label' => 'Пакет', 'key' => 'packages', 'required' => true],
        ['label' => 'Отстъпка', 'key' => 'discounts', 'required' => true],
        ['label' => 'Брой вноски', 'key' => 'installment', 'required' => true],
        ['label' => 'Профил', 'key' => 'profile', 'required' => false],
        ['label' => 'Вид идентификатор', 'key' => 'customer_personal_identification_number_type', 'required' => true],
        ['label' => 'Идентификатор на титуляра', 'key' => 'customer_personal_identification_number', 'required' => true],
        ['label' => 'Име', 'key' => 'first_name', 'required' => true],
        ['label' => 'Презиме', 'key' => 'middle_name', 'required' => false],
        ['label' => 'Фамилия', 'key' => 'last_name', 'required' => true],
        ['label' => 'Област', 'key' => 'customer_district', 'required' => true],
        ['label' => 'Община', 'key' => 'customer_municipality', 'required' => true],
        ['label' => 'Населено място', 'key' => 'customer_town', 'required' => true],
        ['label' => 'Пощенски код', 'key' => 'customer_postcode', 'required' => true],
        ['label' => 'Адрес', 'key' => 'customer_address', 'required' => true],
        ['label' => 'Стационарен телефонен номер', 'key' => 'phone_number', 'required' => false],
        ['label' => 'Мобилен телефонен номер', 'key' => 'mobile_phone', 'required' => true],
        ['label' => 'Имейл', 'key' => 'email', 'required' => true],
        ['label' => 'Застраховката е в полза на трето лице', 'key' => 'is_third_party_beneficiary', 'required' => false],
        ['label' => 'Банка', 'key' => 'bank', 'required' => true],
        ['label' => 'Начин на плащане', 'key' => 'payment_method', 'required' => true],
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
        $selectedValues = (new HomeInsuranceSelectedValuesQuery($this->request))->get();

        $fieldsAbility = (new HomeInsuranceFieldsAbilityQuery($this->request))->get();
        $fieldsVisibility = (new HomeInsuranceFieldsVisibilityQuery($this->request))->get();

        $availableValues = (new HomeInsuranceValidFieldValuesQuery($this->request))->get();

        $res = [];
        $res['fields'] = array_map(function ($field) use ($selectedValues, $availableValues, $fieldsAbility, $fieldsVisibility) {
            $fieldData = [
                'label' => $field['label'],
                'key' => $field['key'],
                'values' => $availableValues[$field['key']] ?? [],
                'selected' => $selectedValues[$field['key']] ?? null,
                'isEnabled' => $fieldsAbility[$field['key']] ?? true,
                'isVisible' => $fieldsVisibility[$field['key']] ?? false,
                'isRequired' => $field['required'] ?? false,
                'placeholder' => $field['placeholder'] ?? null,
            ];

            return $fieldData;
        }, $this->fields);

        $res['step'] = $this->request->input('step', 1); 
               return $res;
    }
}
