@extends('emails.layouts.card', [
    'title' => 'Анулирана полица',
    'content' => [
   ],
])




@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Полицата беше анулирана.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.info-card', [
        'serviceTypeName' => $data['insurance_type_name'],
        'title' => 'Детайли',
        'items' => [
            ['label' => 'Номер на полица:', 'value' => $data['policy_number']],
            ['label' => 'Период на валидност:', 'value' => $data['start_date_formatted'] . ' - ' . $data['end_date_formatted']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Ако мислиш, че е станала грешка, свържи се с нас, ще проверим веднага.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop


