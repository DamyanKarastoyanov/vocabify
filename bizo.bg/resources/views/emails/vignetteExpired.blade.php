@extends('emails.layouts.card', [
    'title' => 'Аларма за изтекла винетка от Бизо',
    'content' => [],
])

@section('content')
    @component('emails.components.heading', ['name' => $data['name'], 'size' => 'h3', 'spaceBottom' => '10px', 'width' => '80%'])
    @endcomponent

    @component('emails.components.p', ['align' => 'center', 'size' => 'h4', 'spaceBottom' => '40px'])
    Винетката на автомобила ти е изтекла и към момента не е активна.
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

    @component('emails.components.button', ['url' => $data['vehicle_link'], 'spaceBottom' => '40px', 'width' => '70%'])
    Провери статуса
    @endcomponent

    @component('emails.components.p', ['align' => 'left', 'size' => 'h4', 'spaceBottom' => '40px'])
    Поднови я, за да избегнеш глоби при движение по републиканската пътна мрежа. Ако вече е подновена – супер! Системата скоро ще се актуализира.
    @endcomponent

    @component('emails.components.salutation')
    @endcomponent
@stop

