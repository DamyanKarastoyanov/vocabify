@props([
    'url' => '#',
    'color' => '#0081EA',
    'weight' => '400',
    'suffix' => '',
    'textDecoration' => 'underline',
])
@php
$attributes = $attributes->merge(['url' => $url, 'color' => $color, 'weight' => $weight, 'suffix' => $suffix, 'textDecoration' => $textDecoration]);
$url = $attributes->get('url');
$color = $attributes->get('color');
$weight = $attributes->get('weight');
$suffix = $attributes->get('suffix');
$textDecoration = $attributes->get('textDecoration');
$fontFamily = $attributes->get('fontFamily');
@endphp
<a href="{!! $url !!}" style="color: {{ $color }}; font-weight: {{ $weight }}; text-decoration: {{ $textDecoration }};" target="_blank">{{ $slot }}</a>{{ $suffix }}
