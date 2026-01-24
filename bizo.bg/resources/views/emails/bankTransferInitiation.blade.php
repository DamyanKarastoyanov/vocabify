@extends('emails.layouts.card', [
	'title' => 'Стартирано е плащане по банков превод',
	'content' => [],
])

@section('content')

    @component('emails.components.heading', ['name' => $data['name'], 'subGreeting' => 'Потвърждаваме, че избра да платиш по банков път.' , 'subGreetingSize' => 'h3', 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['insurance_type_name'],
        'items' => [
            ['label' => 'Сума за плащане:', 'value' => $data['price']],
            ['label' => 'Титуляр на сметката:', 'value' => $data['bank_details']['account_holder']],
            ['label' => 'Банка:', 'value' => $data['bank_details']['bank']],
            ['label' => 'BIC:', 'value' => $data['bank_details']['bic']],
            ['label' => 'IBAN:', 'value' => $data['bank_details']['iban']],
            ['label' => 'Основание за плащане:', 'value' => 'полица ' . $data['policy_number']],
            ['label' => 'Срок за превод:', 'value' => '<span style="color: #DC2626;">до 24 часа</span>'],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

	@component('emails.components.button', ['url' => $data['installments_link'], 'width' => '70%', 'align' => 'center', 'spaceBottom' => '40px', 'spaceLeft' => '0', 'spaceRight' => '0'])
		Моите плащания
	@endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4','letterSpacing' => '0%', 'spaceBottom' => '40px'])
    Ако вече си направил превода – благодарим! Плащането ще бъде отразено, след като го получим по посочената сметка.
    @endcomponent

	@component('emails.components.salutation')
	@endcomponent
@stop


