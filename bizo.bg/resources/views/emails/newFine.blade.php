@extends('emails.layouts.card', [
    'title' => 'Аларма за нова глоба от МВР',
    'content' => [],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'size' => 'h3', 'spaceBottom' => '10px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.p', ['align' => 'center', 'size' => 'h4', 'spaceBottom' => '40px'])
    Получено е ново известие за глоба по твоето ЕГН и номер на шофьорска книжка.
    @endcomponent

    @php
        $items = [];
        if (!empty($data['violation'])) {
            $items[] = ['label' => 'Нарушение:', 'value' => $data['violation']];
        }
        $items[] = ['label' => 'Сума за плащане:', 'value' => $data['amount_to_pay_bgn'] . ' лв.'];
        if (!empty($data['discount_bgn']) && $data['discount_bgn'] > 0) {
            $items[] = ['label' => 'Отстъпка:', 'value' => $data['discount_bgn'] . ' лв.'];
        }
    @endphp
    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['service_type_name'],
        'items' => $items,
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['fines_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Виж детайлите
    @endcomponent

    @component('emails.components.p', [ 'size' => 'h4', 'spaceBottom' => '40px'])
    Ако вече е платена – всичко е наред, скоро информацията ще се актуализира в системата. Bizo е винаги наблизо, за да те държи в течение за всичко важно.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

