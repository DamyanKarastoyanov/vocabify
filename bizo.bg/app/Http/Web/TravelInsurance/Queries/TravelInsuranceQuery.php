<?php

namespace App\Http\Web\TravelInsurance\Queries;

use Illuminate\Http\Request;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceAdditionalCoverage;

class TravelInsuranceQuery
{
    protected array $fields = [
        ['label' => 'Начална дата', 'key' => 'start_date', 'required' => true],
        ['label' => 'Крайна дата', 'key' => 'end_date', 'required' => true],
        ['label' => 'Валута', 'key' => 'currency', 'required' => true],
        ['label' => 'Дестинации', 'key' => 'destination', 'required' => true],
        ['label' => 'Причина за пътуването', 'key' => 'travel_type', 'required' => true],
        ['label' => 'Дейност', 'key' => 'travel_type_activity', 'required' => true],
        ['label' => 'Застрахователна сума', 'key' => 'insurance_amount', 'required' => true],
        ['label' => 'Възрастова група', 'key' => 'customer_group', 'required' => true],
        ['label' => 'Брой застраховани', 'key' => 'number_of_passengers', 'required' => true],
        ['label' => 'Под 18г.', 'key' => 'number_of_passengers_under_18', 'required' => false],
        ['label' => 'От 18 до 26г.', 'key' => 'number_of_passengers_under_26', 'required' => false],
        ['label' => 'Допълнителни рискове', 'key' => 'additional_risks', 'required' => false],
        ['label' => 'Профил', 'key' => 'profile', 'required' => false],
        ['label' => 'Застраховани лица', 'key' => 'persons', 'required' => false],
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
        ['label' => 'Име на латиница', 'key' => 'latin_full_name', 'required' => true],
        ['label' => 'Дата на раждане', 'key' => 'birth_date', 'required' => false],
        ['label' => 'Застрахованото лице е и застраховащ', 'key' => 'is_insurer_also_a_customer', 'required' => false],
        ['label' => 'Учащ', 'key' => 'is_student', 'required' => false],
        ['label' => 'Начин на плащане', 'key' => 'payment_method', 'required' => true],
    ];

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->addAdditionalRiskAmountFields();
    }

    private function addAdditionalRiskAmountFields(): void
    {
        $additionalRiskFields = [];

        $additionalCoverages = AxiomTravelInsuranceAdditionalCoverage::all();

        foreach ($additionalCoverages as $coverage) {
            $additionalRiskFields[] = [
                'label' => $coverage->name . ' - Застрахователна сума',
                'key' => "additional_risk_{$coverage->axiom_id}_amount",
                'required' => false
            ];
        }

        $insertPosition = 0;
        foreach ($this->fields as $index => $field) {
            if ($field['key'] === 'additional_risks') {
                $insertPosition = $index + 1;
                break;
            }
        }

        array_splice($this->fields, $insertPosition, 0, $additionalRiskFields);
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $selectedValues = (new TravelInsuranceSelectedValuesQuery($this->request))->get();

        $fieldsAbility = (new TravelInsuranceFieldsAbilityQuery($this->request))->get();
        $fieldsVisibility = (new TravelInsuranceFieldsVisibilityQuery($this->request))->get();

        $availableValues = (new TravelInsuranceValidFieldValuesQuery($this->request))->get();

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
