@extends('emails.layouts.card', [
    'title' => 'Неуспешно плащане с карта',
    'content' => [
    ],
])

@section('content')

    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Опитът за плащане на застраховката с карта не беше успешен.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Препоръчваме да опиташ отново с друга карта, да избереш друг метод на плащане или да се свържеш с издателя на картата си, ако проблемът се повтори.
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'items' => [
            ['label' => 'Сума за плащане:', 'value' => $data['price']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop
