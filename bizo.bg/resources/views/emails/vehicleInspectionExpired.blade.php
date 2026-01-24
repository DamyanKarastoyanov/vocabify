@extends('emails.layouts.card', [
    'title' => 'Аларма за изтекъл ГТП от Бизо',
    'content' => [],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'size' => 'h3', 'spaceBottom' => '10px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.p', ['align' => 'center', 'size' => 'h4', 'spaceBottom' => '40px'])
    Искаме да те уведомим, че годишният технически преглед на автомобила ти е изтекъл.
    @endcomponent

    @component('emails.components.info-card', [
        'title' => 'Детайли',
        'serviceTypeName' => $data['service_type_name'],
        'items' => [
            ['label' => 'Рег. номер:', 'value' => $data['reg_number']],
            ['label' => 'Изтекъл на:', 'value' => $data['expired_date_formatted']],
        ],
        'spaceBottom' => '30px',
        'width' => '70%',
    ])
    @endcomponent

    @component('emails.components.button', ['url' => $data['vehicle_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Провери статуса
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Предприеми необходимите действия възможно най-скоро. Bizo е винаги наблизо, за да следи важните срокове вместо теб и да ти помага да останеш защитен на пътя.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

