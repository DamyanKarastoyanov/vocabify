@extends('emails.layouts.card', [
	'title' => 'Изтичащи банкови преводи',
	'content' => [],
])

@section('content')

	@component('emails.components.heading', ['name' => $data['name'] ?? null, 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
	@endcomponent

	@component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'weight' => '400', 'spaceBottom' => '40px'])
		Това е списък с банкови преводи, които все още не са потвърдени, въпреки че срокът от 24 часа вече изтича или е изтекъл.
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

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'weight' => '400', 'spaceBottom' => '40px'])
        Можеш да следиш състоянието и от админ панела, раздел
        @component('emails.components.link', ['url' => $data['payments_link']])
            <b>Плащания</b>
        @endcomponent .
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'weight' => '400'])
        Поздрави, <br>
        Екипът на
        @component('emails.components.link', ['url' => route('welcome')])
            <u>Bizo.bg</u>
        @endcomponent
    @endcomponent

@stop


