@component('emails.components.p', ['align' => 'left', 'size' => 'h4','lineHeight' => '24px', 'letterSpacing' => '0%', 'spaceBottom' => '40px'])
Ако имаш въпроси или нужда от съдействие, винаги сме насреща.
@endcomponent

@component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'lineHeight' => '24px', 'letterSpacing' => '0%', 'spaceBottom' => '40px'])
Благодарим ти, че се довери на
    @component('emails.components.link', ['url' => route('welcome')])
        <u>Bizo.bg</u>
    @endcomponent
@endcomponent

@component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'lineHeight' => '24px', 'letterSpacing' => '0%'])
    Поздрави, <br>
    Екипът на
    @component('emails.components.link', ['url' => route('welcome')])
        <u>Bizo.bg</u>
    @endcomponent
@endcomponent
