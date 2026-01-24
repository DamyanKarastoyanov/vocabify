@extends('emails.layouts.card', [
    'title' => 'Плащането мина успешно!',
    'content' => [
    ],
])
@section('content')
    @component('emails.components.heading', [
        'name' => $data['name'],
        'subGreeting' => $data['is_in_manual_review']
            ? 'Потвърждаваме, че плащането с карта мина успешно, но БЕЗ издадена полица'
            : 'Потвърждаваме, че плащането с карта мина успешно!',
        'subGreetingSize' => 'h3',
        'greetingSize' => 'h3',
        'spaceBottom' => '40px',
        'width' => '80%',
    ])
    @endcomponent

    @if($data['is_in_manual_review'])
        @component('emails.components.info-card', [
            'title' => 'Детайли',
            'items' => [
                ['label' => 'Сума:', 'value' => $data['price']],
            ],
            'spaceBottom' => '40px',
            'width' => '70%',
        ])
        @endcomponent

        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
            <b>Полицата все още не е издадена.</b>
        @endcomponent

        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Щом бъде издадена, ще ти изпратим имейл с всички документи.
        @endcomponent

        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Дебит нотата е прикачена към настоящия имейл, скоро ще получиш и издадената полица.
        @endcomponent

    @else
        @component('emails.components.info-card', [
            'title' => 'Детайли',
            'serviceTypeName' => $data['insurance_type_name'],
            'items' => [
                ['label' => 'Сума:', 'value' => $data['price']],
                ['label' => 'Номер на полица:', 'value' => $data['policy_number']],
            ],
            'spaceBottom' => '40px',
            'width' => '70%',
        ])
        @endcomponent

        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Дебит нотата е прикачена към настоящия имейл, скоро ще получиш и издадената полица.
        @endcomponent
    @endif

    @component('emails.components.salutation')
    @endcomponent
@stop
