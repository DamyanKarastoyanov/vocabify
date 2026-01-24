@props([
    'buttonText' => '',
    'additionalText' => '',
    'url' => '#',
    'button' => 'green',
    'spaceBottom' => '0',
    'spaceTop' => '0',
    'spaceLeft' => '0',
    'spaceRight' => '0',
])
@php
$attributes = $attributes->merge(['url' => $url, 'button' => $button, 'spaceBottom' => $spaceBottom, 'spaceTop' => $spaceTop,'spaceLeft' => $spaceLeft, 'spaceRight' => $spaceRight, 'buttonText' => $buttonText, 'additionalText' => $additionalText]);
$url = $attributes->get('url');
$button = $attributes->get('button');
$spaceBottom = $attributes->get('spaceBottom');
$spaceTop = $attributes->get('spaceTop');
$spaceLeft = $attributes->get('spaceLeft');
$spaceRight = $attributes->get('spaceRight');
$buttonText = $attributes->get('buttonText');
$additionalText = $attributes->get('additionalText');

$backgroundColor = '#0063B3';
$fontColor = '#FFFFFF';

@endphp

@component('emails.components.button', ['url' => $url, 'button' => $button, 'spaceBottom' => '8px', 'spaceTop' => $spaceTop, 'spaceLeft' => $spaceLeft, 'spaceRight' => $spaceRight])
{{$buttonText}}
@endcomponent

@component('emails.components.p', ['align' => 'center', 'size' => 'small', 'spaceBottom' => $spaceBottom, 'spaceLeft' => $spaceLeft, 'spaceRight' => $spaceRight])
    <i>{{$additionalText}}</i>
@endcomponent
