<?php

namespace App\Http\Web\NonResidentInsurance\Queries;

use Illuminate\Http\Request;

class NonResidentInsuranceQuery
{
    protected array $fields = [
        ['label' => 'Начална дата', 'key' => 'start_date', 'required' => true],
        ['label' => 'Период', 'key' => 'period', 'required' => true],
        ['label' => 'Валута', 'key' => 'currency', 'required' => true],
        ['label' => 'Възрастова група', 'key' => 'customer_group', 'required' => true],
        ['label' => 'Брой застраховани', 'key' => 'insured_count', 'required' => true],
        ['label' => 'Брой вноски', 'key' => 'installment', 'required' => true],
        ['label' => 'Профил', 'key' => 'profile', 'required' => false],
        ['label' => 'Застраховани лица', 'key' => 'persons', 'required' => false],
        ['label' => 'Вид идентификатор', 'key' => 'personal_identification_number_type', 'required' => true],
        ['label' => 'Идентификатор на титуляра', 'key' => 'personal_identification_number', 'required' => true],
        ['label' => 'Име', 'key' => 'first_name', 'required' => true],
        ['label' => 'Презиме', 'key' => 'middle_name', 'required' => false],
        ['label' => 'Фамилия', 'key' => 'last_name', 'required' => true],
        ['label' => 'Име на латиница', 'key' => 'latin_full_name', 'required' => true],
        ['label' => 'Дата на раждане', 'key' => 'birth_date', 'required' => false],
        ['label' => 'Държава', 'key' => 'country', 'required' => true],
        ['label' => 'Област', 'key' => 'district', 'required' => true],
        ['label' => 'Община', 'key' => 'municipality', 'required' => true],
        ['label' => 'Населено място', 'key' => 'town', 'required' => true],
        ['label' => 'Пощенски код', 'key' => 'postcode', 'required' => true],
        ['label' => 'Адрес', 'key' => 'address', 'required' => true],
        ['label' => 'Нямам номер на български мобилен оператор', 'key' => 'is_mobile_number_available', 'required' => false],
        ['label' => 'Мобилен телефонен номер', 'key' => 'mobile_phone', 'required' => true],
        ['label' => 'Застрахованото лице е и застраховащ', 'key' => 'is_insurer_also_a_customer', 'required' => false],
        ['label' => 'Начин на плащане', 'key' => 'payment_method', 'required' => true],
        ['label' => 'Имейл', 'key' => 'email', 'required' => true],
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
        $selectedValues = (new NonResidentInsuranceSelectedValuesQuery($this->request))->get();

        $fieldsAbility = (new NonResidentInsuranceFieldsAbilityQuery($this->request))->get();
        $fieldsVisibility = (new NonResidentInsuranceFieldsVisibilityQuery($this->request))->get();

        $availableValues = (new NonResidentInsuranceValidFieldValuesQuery($this->request))->get();

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

        //$res['actions'] = $this->getTaskActions($this->task);

        return $res;
    }
}
