@extends('emails.layouts.card', [
    'title' => 'Напомняне за изтичащ ГТП от Бизо',
    'content' => [],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Напомняме, че техническият преглед на автомобила ти изтича скоро.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['service_type_name'],
        'items' => [
            ['label' => 'Рег. номер:', 'value' => $data['reg_number']],
            ['label' => 'Валиден до:', 'value' => $data['next_inspection_date_formatted']],
            ['label' => 'Оставащи дни:', 'value' => $data['days_until_expiry']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['vehicle_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Провери статуса
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Bizo е винаги наблизо, за да следи важните срокове вместо теб.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

