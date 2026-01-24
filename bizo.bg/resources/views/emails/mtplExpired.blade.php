@extends('emails.layouts.card', [
    'title' => 'Аларма за изтекла ГО от Бизо',
    'content' => [],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'size' => 'large', 'spaceBottom' => '40px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.p', [ 'size' => 'h4', 'spaceBottom' => '40px'])
    Гражданската отговорност на автомобила ти е изтекла. В момента няма активна застраховка, което може да доведе до санкции.
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['service_type_name'],
        'items' => [
            ['label' => 'Рег. номер:', 'value' => $data['reg_number']],
            ['label' => 'Изтекла на:', 'value' => $data['expired_date_formatted']],
        ],
        'spaceBottom' => '40px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['mtpl_offers_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Разгледай оферти
    @endcomponent

    @component('emails.components.p', [ 'size' => 'h4', 'spaceBottom' => '40px'])
    Ако междувременно вече си подновил полицата – чудесно! Скоро ще се отрази автоматично в системата. Bizo е винаги наблизо, за да следи важните срокове вместо теб и да те предпазва от неприятни изненади.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

