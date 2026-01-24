@extends('emails.layouts.card', [
    'title' => 'Напомняне за изтичаща полица от Бизо',
    'content' => [
    ],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Напомняме, че полицата ти изтича скоро.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['insurance_type_name'],
        'items' => [
            ['label' => 'Номер на полица:', 'value' => $data['policy_number']],
            ['label' => 'Изтича на:', 'value' => $data['expiration_date_formatted'] . ' г.'],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent


    @component('emails.components.button', ['url' => $data['policies_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Моите Полици
    @endcomponent

    @component('emails.components.p', ['size' => 'h4', 'spaceBottom' => '40px'])
    Можеш да я
    @component('emails.components.link', ['url' => $data['policy_link']])
        прегледаш
    @endcomponent
    или подновиш по всяко време в профила си в
    @component('emails.components.link', ['url' => route('welcome')])
        <u>Bizo.bg</u>
    @endcomponent.
    @endcomponent

    @component('emails.components.p', ['size' => 'h4', 'spaceBottom' => '40px'])
    Подновяването става бързо и лесно – не го оставяй за последния момент.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop
