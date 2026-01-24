@extends('emails.layouts.card', [
    'title' => 'Активация на акаунт',
    'content' => [
   ],
])

@section('content')

    @component('emails.components.heading', [ 'greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent
    
    @if(isset($data['is_after_policy_activation']) && $data['is_after_policy_activation'])
        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px', 'weight' => '400'])
        За да го активираш, кликни на бутона:
        @endcomponent
    @else
        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px', 'weight' => '400'])
        За да активираш акаунта си, просто кликни на бутона по-долу.
        @endcomponent
    @endif

    @component('emails.components.button', ['url' => $data['activation_link'], 'width' => '50%', 'button' => 'green', 'spaceBottom' => '30px'])
        {{ isset($data['is_after_policy_activation']) && $data['is_after_policy_activation'] ? 'Активиране на акаунт' : 'Активирай акаунта си' }}
    @endcomponent

    @if(!isset($data['is_after_policy_activation']) || !$data['is_after_policy_activation'])
        @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '30px', 'weight' => '400'])
        Ако не си създавал акаунт, можеш спокойно да игнорираш този имейл.
        @endcomponent
    @endif

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '30px', 'weight' => '400'])
    Ако имаш въпроси или нужда от съдействие, винаги сме насреща.
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '0px', 'weight' => '400'])
    Благодарим ти, че се довери на Bizo.bg
    @endcomponent
@stop


