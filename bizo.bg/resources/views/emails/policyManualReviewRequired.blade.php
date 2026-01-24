@extends('emails.layouts.card', [
    'title' => 'Необходима е ръчна проверка (Полица)',
    'content' => [
    ],
])

@section('content')
        @component('emails.components.heading', ['name' => $data['user_name'] ?? null, 'subGreeting' => 'Внимание: Полица изискваща проверка' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Клиентска полица е в статус 'Колегата го гледа' и изисква приоритетно действие от екипа.
    @endcomponent

    @component('emails.components.info-card', [
        'serviceTypeName' => $data['insurance_type_name'] ?? null,
        'title' => 'Детайли',
        'items' => [
            ['label' => 'Клиент:', 'value' => $data['user_full_name'] ?? '-'],
            ['label' => 'Номер на полица:', 'value' => $data['policy_number'] ?? '-'],
            ['label' => 'Период на валидност:', 'value' => $data['start_date_formatted'] . ' — ' . $data['end_date_formatted']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['policy_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Отвори полицата
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop
