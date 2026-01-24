<?php

namespace App\Http\Web\Policies\Queries;

use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsurancePolicy;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsurancePolicy;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsurancePolicy;
use Domain\Insurance\Models\Policy;
use Domain\Users\Models\Address;
use Illuminate\Http\Request;

class PolicyDetailsQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected Policy $policy,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        $insurable = $this->policy->insurable;

        [$insurableName, $insurableValue] = match (get_class($insurable)) {
            AxiomHomeInsurancePolicy::class => [
                'Имот',
                $this->policy->title ?? '-'],
            AxiomTravelInsurancePolicy::class => [
                'Дестинация',
                $this->policy->title ?? '-'],
            AxiomNonResidentInsurancePolicy::class => [
                'Лице',
                $this->policy->title ?? '-'],
            default => ['-', '-'],
        };

        $statusName = '-';

        switch ($this->policy->internalStatus->name) {
            case 'Draft':
                $statusName = 'Чернова';
                break;
            case 'Pending Customer Action':
                $statusName = 'Ти си на ход';
                break;
            case 'Pending Insurer Confirmation':
                $statusName = 'Одобрението пътува';
                break;
            case 'Awaiting Payment Confirmation':
                $statusName = 'Очаква плащане';
                break;
            case 'Manual Review':
                $statusName = 'Колегата го гледа';
                break;
            case 'Active':
                $statusName = 'Активна';
                break;
            case 'Expired':
                $statusName = 'Изтекла';
                break;
            case 'Cancelled':
                $statusName = 'Отменена';
                break;
            case 'Declined':
                $statusName = 'Отказана';
                break;
            default:
                $statusName = '-';
        }

        $descriptions = [
            'draft' => 'Започнал си, но не си я финализирал – можеш да продължиш по всяко време.',
            'pending_customer_action' => 'Трябва да попълниш или потвърдиш информация. Не го отлагай – става бързо.',
            'pending_insurer_confirmation' => 'Всичко е подадено – очакваме одобрение. Малко търпение.',
            'awaiting_payment_confirmation' => 'Чакаме потвърждение за плащането. След като получим превода, ще го отразим в системата.',
            'manual_review' => 'Минава през човешка проверка. Ще се свържем с теб при нужда.',
            'active' => 'Всичко е наред – документите са в профила ти.',
            'expired' => 'Срокът е приключил. Ако ти трябва нова – насреща сме.',
            'cancelled' => 'Полицата вече не е валидна. Ако има грешка – свържи се с нас.',
            'declined' => 'Застрахователят не одобри полицата. Коригирай данните и пробвай пак.',
        ];

        $result = [
            'status' => $statusName,
            'status_description' => $descriptions[$this->policy->internalStatus->code] ?? '',
            'title' => $this->policy->title,
            'start_date' => $this->policy->start_date,
            'end_date' => $this->policy->end_date,
            'policy_number' => $this->policy->policy_number,
            'payment_reference' => $this->policy->payment_reference,
            'insurer_name' => $this->policy->insuranceCompany->name ?? 'Unknown',
            'price' => $this->policy->price,
            'insurance_name' => $this->policy->insuranceType->name ?? '-',
            'insurable_name' => $insurableName,
            'insurable_value' => $insurableValue,
            'payment_type' =>$this->policy->installments->count() > 1 ? 'Разсрочено плащане' : 'Еднократно',
            'download_url' => $this->policy->isDownloadable() ? $this->policy->insurable->downloadUrl : null,
        ];

        return $result;
    }
}
