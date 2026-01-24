<?php

namespace App\Http\Web\MTPLInsurance\Queries;

use Illuminate\Http\Request;

class MTPLInsuranceQuery
{
    protected array $fields = [
        //1 - call route('mtpl-insurance.vehicle-person-data') then move to step 2
        ['label' => 'Автомобил', 'key' => 'vehicle', 'required' => false],
        ['label' => 'Регистрационен номер', 'key' => 'number', 'required' => true],
        ['label' => 'Талон', 'key' => 'talon', 'required' => true, 'placeholder' => '918273645'],
        //2 - call route('mtpl-insurance.get-offer') after done with data collection - polling until 120s or finished: true!
        ['label' => 'Марка', 'key' => 'model_name', 'required' => true],
        ['label' => 'Модел', 'key' => 'mark_name', 'required' => true],
        ['label' => 'Рама', 'key' => 'vin', 'required' => true],
        ['label' => 'Волан на МПС', 'key' => 'wheel_direction', 'required' => true],
        ['label' => 'Начална дата на полицата', 'key' => 'policy_start_date', 'required' => true],
        ['label' => 'Брой вноски', 'key' => 'policy_installments', 'required' => true],
        ['label' => 'Обем на двигателя', 'key' => 'engine_volume', 'broqeeKey' => 'vehicle.engine_volume', 'required' => true],
        ['label' => 'Мощност на двигателя (kW)', 'key' => 'engine_power_kw', 'broqeeKey' => 'vehicle.engine_power_kw', 'required' => true],
        ['label' => 'Стаж на водача', 'key' => 'driver_experience', 'broqeeKey' => 'insured.xp', 'required' => true],
        ['label' => 'Предназначение на МПС', 'key' => 'vehicle_usage', 'broqeeKey' => 'vehicle.usage', 'required' => true],
        //additional fields of calculate-price step
        ['label' => 'Тегло на МПС', 'key' => 'gross_weight', 'broqeeKey' => 'vehicle.gross_weight', 'required' => false],
        ['label' => 'Места в МПС', 'key' => 'vehicle_places', 'broqeeKey' => 'vehicle.places', 'required' => false],
        ['label' => 'Дата на раждане', 'key' => 'birth_date', 'broqeeKey' => 'insured.birth_date', 'required' => false],
        ['label' => 'Населено място', 'key' => 'location_id', 'broqeeKey' => 'insured.location', 'required' => false],
        ['label' => 'Адрес', 'key' => 'address', 'broqeeKey' => 'insured.address', 'required' => false],
        ['label' => 'Националност', 'key' => 'nationality', 'broqeeKey' => 'insured.nationality', 'required' => false],
        //4 - after being done with selecting the insurer call route('mtpl-insurance.choose-insurer') - look for additional fields!
        //once all data is filled - do a confirm-offer call AND THEN! get to the payment step
        ['label' => 'Профил', 'key' => 'profile', 'required' => false],
        ['label' => 'Име', 'key' => 'first_name', 'required' => true],
        ['label' => 'Фамилия', 'key' => 'last_name', 'required' => true],
        ['label' => 'Телефон', 'key' => 'insured_phone', 'required' => true],
        ['label' => 'Имейл', 'key' => 'insured_email', 'required' => true],
        //5 - once done with payment call route('mtpl-insurance.issue-policy') -  issue policy call.
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
        $selectedValues = (new MTPLInsuranceSelectedValuesQuery($this->request))->get();

        $fieldsAbility = (new MTPLInsuranceFieldsAbilityQuery($this->request))->get();
        $fieldsVisibility = (new MTPLInsuranceFieldsVisibilityQuery($this->request))->get();

        $availableValues = (new MTPLInsuranceValidFieldValuesQuery($this->request))->get();

        $res = [];
        $res['fields'] = array_map(function ($field) use ($selectedValues, $availableValues, $fieldsAbility, $fieldsVisibility) {
            $fieldData = [
                'label' => $field['label'],
                'key' => $field['key'],
                'broqeeKey' => $field['broqeeKey'] ?? null,
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
