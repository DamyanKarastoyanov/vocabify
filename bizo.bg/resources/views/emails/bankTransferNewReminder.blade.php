@extends('emails.layouts.card', [
	'title' => 'Нови банкови преводи',
	'content' => [],
])

@section('content')

	@component('emails.components.heading', ['name' => $data['name'] ?? null, 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
	@endcomponent

	@component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'weight' => '400', 'spaceBottom' => '40px'])
		Това е списък с всички нови банкови преводи, регистрирани в системата през последните 24 часа.
	@endcomponent

	@if($data['items']->isEmpty())
		@component('mail::table')
		| ID на Полицa | Връзка към полицa | Връзка към превод | Оставащо време |
		|:--------|:-------------------|:------------------|:---------------|
		@endcomponent
	@else
		@php
			$tableItems = [];
			foreach($data['items'] as $item) {
				$policyLink = $item['policy_link'] ? '[Отвори](' . $item['policy_link'] . ')' : '-';
				$transferLink = '[Отвори](' . $item['transfer_link'] . ')';
				
				$tableItems[] = [
					'policy_number' => $item['policy_number'] ?? '-',
					'policy_link' => $policyLink,
					'transfer_link' => $transferLink,
					'time_remaining' => $item['time_remaining'],
				];
			}
		@endphp
		@component('emails.components.info-card', [
			'items' => $tableItems,
			'displayAsTable' => true,
			'title' => 'Плащания',
			'tableHeaders' => ['ID на Полицa', 'Връзка към полицa', 'Връзка към превод', 'Оставащо време'],
			'tableColumns' => ['policy_number', 'policy_link', 'transfer_link', 'time_remaining'],
			'spaceBottom' => '40px'
		])
		@endcomponent
	@endif

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4','spaceBottom' => '40px', 'weight' => '400'])
    Можеш да прегледаш и обработиш всеки от преводите директно от съответния линк.
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px', 'weight' => '400'])
        Ако имаш нужда от по-стара справка – използвай админ панела. <br>
	@endcomponent

	@component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'weight' => '400'])
        Поздрави, <br>
        Екипът на
        @component('emails.components.link', ['url' => route('welcome')])
            <u>Bizo.bg</u>
        @endcomponent
    @endcomponent
@stop

