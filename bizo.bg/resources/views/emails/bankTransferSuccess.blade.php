@extends('emails.layouts.card', [
	'title' => 'Потвърдено плащане',
	'content' => [],
])

@section('content')
	@component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Банковият превод е получен и успешно обработен.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
	@endcomponent
	

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

	@component('emails.components.salutation')
	@endcomponent
@stop
