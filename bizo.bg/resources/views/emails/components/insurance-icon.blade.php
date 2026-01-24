@props([
    'serviceTypeName' => null,
])

@php
$iconPath = null;

if (!empty($serviceTypeName)) {
    $mapping = [
        'Гражданска отговорност' => 'mtpl-insurance',
        'Медицинска застраховка за чужденци' => 'non-resident-insurance',
        'Застраховка при пътуване в чужбина' => 'travel-insurance',
        'Застраховка имущество' => 'home-insurance',
        'Годишен технически преглед' => 'vehicle-inspection-service',
        'Проверка на Винетка' => 'vignette-service',
        'Проверка на глоби от МВР' => 'mvr-fines-check-service',
        'Проверка на ГО' => 'mtpl-insurance',
    ];
    
    $trimmedName = trim((string)$serviceTypeName);
    $mappedIconCode = $mapping[$trimmedName] ?? null;
    if ($mappedIconCode) {
        $iconPath = Config::get("app.url") . "/resources/assets/" . $mappedIconCode . ".png";
    }
}
@endphp

@if(!empty($iconPath))
<div style="text-align: center; margin-bottom: 8px;">
    <img src="{{ $iconPath }}" alt="" style="display: inline-block; width: 48px; height: 48px;" width="48" height="48">
</div>
@endif

