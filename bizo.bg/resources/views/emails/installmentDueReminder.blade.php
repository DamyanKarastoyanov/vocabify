@extends('emails.layouts.card', [
    'title' => 'Напомняне за предстояща вноска от Бизо',
    'content' => [
    ],
])



@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Напомняме, че имаш предстояща вноска по полица.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['insurance_type_name'],
        'items' => [
            ['label' => 'Номер на полица:', 'value' => $data['policy_number']],
            ['label' => 'Срок за плащане:', 'value' => $data['due_date_formatted']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['payment_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Плати вноска
    @endcomponent

    @component('emails.components.p', [ 'size' => 'h4', 'spaceBottom' => '40px'])
    Можеш да видиш
    @component('emails.components.link', ['url' => $data['installments_link']])
        <b>всички вноски</b>
    @endcomponent
    и срокове по всяко време в профила си в
        @component('emails.components.link', ['url' => route('welcome')])
            <b>Bizo.bg</b>
        @endcomponent
    @endcomponent

    @component('emails.components.p', [ 'size' => 'h4', 'spaceBottom' => '40px'])
    Ако вече си платил, скоро ще се отрази в системата.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop
