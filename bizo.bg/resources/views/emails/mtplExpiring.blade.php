@extends('emails.layouts.card', [
    'title' => 'Напомняне за изтичаща ГО от Бизо',
    'content' => [],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Напомняме, че гражданската отговорност на автомобила ти изтича скоро.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px'])
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['service_type_name'],
        'items' => [
            ['label' => 'Рег. номер:', 'value' =>$data['reg_number']],
            ['label' => 'Валиден до:', 'value' =>$data['end_date_formatted']],
            ['label' => 'Оставащи дни:', 'value' =>$data['days_until_expiry']],
        ],
        'spaceBottom' => '30px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['mtpl_offers_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Разгледай оферти
    @endcomponent

    @component('emails.components.p', [ 'size' => 'h4', 'spaceBottom' => '40px'])
    Ако вече е подновена – супер! Скоро ще се отрази в системата. Bizo е винаги наблизо, за да следи важните срокове вместо теб.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

