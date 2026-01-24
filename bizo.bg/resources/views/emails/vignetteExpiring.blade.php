@extends('emails.layouts.card', [
    'title' => 'Напомняне за изтичаща винетка от Бизо',
    'content' => [],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Напомняме, че винетката на автомобила ти изтича скоро.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['service_type_name'],
        'items' => [
            ['label' => 'Рег. номер:', 'value' => $data['reg_number']],
            ['label' => 'Валиден до:', 'value' => $data['valid_to_formatted']],
            ['label' => 'Оставащи дни:', 'value' => $data['days_until_expiry']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['vehicle_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Провери валидността
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Поднови навреме, за да избегнеш глоби. Ако вече е подновена – супер! Скоро ще се отрази в системата.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

