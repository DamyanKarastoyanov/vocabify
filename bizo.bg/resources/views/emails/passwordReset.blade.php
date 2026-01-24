@extends('emails.layouts.card', [
    'title' => 'Възстановяване на парола',
    'content' => [
    ],
])

@section('content')

    @component('emails.components.heading', ['greetingSize' => 'h3', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Получихме заявка за възстановяване на паролата към акаунта ти.
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Ако това беше ти, можеш да зададеш нова парола, като натиснеш бутона:
    @endcomponent

    @component('emails.components.button', ['url' => $reset_url, 'width' => '50%', 'spaceBottom' => '40px'])
    Смени парола
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Линкът ще бъде активен 60 минути.
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Ако не си изпращал такава заявка, можеш спокойно да игнорираш този имейл.
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
        Ако имаш проблем с бутона, можеш да копираш и поставиш следния линк директно в браузъра си: <br>
        @component('emails.components.link', ['url' => $reset_url])
            <u>{{ $reset_url }}</u>
        @endcomponent
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop



