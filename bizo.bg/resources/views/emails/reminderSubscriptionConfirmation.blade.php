@extends('emails.layouts.card', [
    'title' => $data['has_account'] ? 'Bizo следи сроковете по всички твои автомобили' : 'Твоят абонамент за напомняния от Bizo е активен',
    'content' => [],
])

@section('content')
    @if($data['has_account'])
        @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Чудесна новина – твоят абонамент за напомняния от Bizo е вече активен за целия ти автопарк.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
        @endcomponent
    @else
        @component('emails.components.heading', ['name' => null, 'subGreeting' => 'Вече си част от Bizo! ' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
        @endcomponent
    @endif

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Успешно се абонира за автоматични напомняния за твоя автомобил. Ние ще следим важните срокове вместо теб, за да пътуваш спокойно.
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => null,
        'items' => [
            ['label' => $data['has_account'] ? 'Активни автомобили:' : 'Автомобил:', 'value' => $data['vehicle_registration']],
            ['label' => 'Услуги:', 'value' => 'ГТП, ГО и винетка']
            ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @if($data['has_account'])
        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Защо това е удобно? Оттук нататък, всеки нов автомобил, който добавиш в акаунта си, ще бъде автоматично асоцииран и добавян към списъка за напомняния. Без нужда от допълнителни настройки – ние ще те информираме за всички важни срокове и проверки по имейл.
        @endcomponent

        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Ако смяташ, че си получил този имейл по погрешка, можеш да го игнорираш или да се отпишеш тук: 
            @component('emails.components.link', ['url' => $data['unsubscribe_url']])
                <u>oтписване</u>
            @endcomponent
        @endcomponent
    @else
        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Какво следва? Ще получаваш от нас известия, когато наближи важна дата по услугите по-горе, свързани с този автомобил. Няма нужда да правиш нищо повече.
        @endcomponent

        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        <strong>Имаш и друг автомобил?</strong> Не оставяй нищо на случайността. Можеш да добавиш и други превозни средства в профила си, за да получаваш напомняния за всяко от тях по имейл напълно безплатно. 
        @endcomponent

        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
            @component('emails.components.link', ['url' => $data['register_url']])
                Регистрирай се
            @endcomponent
            и добави 
            @component('emails.components.link', ['url' => $data['vehicles_page_url']])
                нов автомобил
            @endcomponent
            още сега.
         @endcomponent

         @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
         Ако не си се абонирал ти или имейлът е попаднал при теб по погрешка, просто го игнорирай. Можеш да се откажеш от напомнянията по всяко време от тук: 
            @component('emails.components.link', ['url' => $data['unsubscribe_url']])
                <u>отписване</u>
            @endcomponent
         @endcomponent
    @endif


    @component('emails.components.salutation')
    @endcomponent
@stop
