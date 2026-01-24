@extends('emails.layouts.card', [
    'title' => 'Успешно издадена полица',
    'content' => [
    ],
])



@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Полицата беше успешно издадена и е прикачена към този имейл.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['insurance_type_name'],
        'items' => [
            ['label' => 'Номер на полица:', 'value' => $data['policy_number']],
            ['label' => 'Период на валидност:', 'value' => $data['start_date_formatted'] . ' - ' . $data['end_date_formatted']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    За преглед, проследяване и достъп до имейл нотификации по всички твои застраховки, закупени през 
    @component('emails.components.link', ['url' => route('welcome')])
        <u>Bizo.bg</u>.
    @endcomponent, препоръчваме да активираш профила си в сайта ни.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

