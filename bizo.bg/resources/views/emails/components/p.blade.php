@props([
    'size' => 'text',
    'color' => '#001527',
    'spaceBottom' => '0',
    'spaceTop' => '0',
    'align' => 'left',
    'weight' => '400',
    'spaceLeft' => '0',
    'spaceRight' => '0',
    'fontStyle' => 'normal',
    'as' => 'p',
    'lineHeight' => null,
    'letterSpacing' => null,
])

@php
$attributes = $attributes->merge(['size' => $size, 'color' => $color, 'spaceBottom' => $spaceBottom, 'spaceTop' => $spaceTop, 'align' => $align, 'weight' => $weight, 'spaceLeft' => $spaceLeft, 'spaceRight' => $spaceRight, 'fontStyle' => $fontStyle, 'as' => $as, 'lineHeight' => $lineHeight, 'letterSpacing' => $letterSpacing]);

$size = $attributes->get('size');
$color = $attributes->get('color');
$spaceBottom = $attributes->get('spaceBottom');
$spaceTop = $attributes->get('spaceTop');
$align = $attributes->get('align');
$weight = $attributes->get('weight');
$spaceLeft = $attributes->get('spaceLeft');
$spaceRight = $attributes->get('spaceRight');
$fontStyle = $attributes->get('fontStyle');
$as = $attributes->get('as');
$lineHeight = $attributes->get('lineHeight');
$letterSpacing = $attributes->get('letterSpacing');

$originalLineHeight = $lineHeight;

switch ($size) {
    case 'h3':
        $fontSize = '24px';
        $lineHeight = $originalLineHeight ?? '32px';
        break;
    case 'h4':
        $fontSize = '18px';
        $lineHeight = $originalLineHeight ?? '28px';
        break;
    case 'h5':
        $fontSize = '16px';
        $lineHeight = $originalLineHeight ?? '24px';
        break;
    default:
        $fontSize = '14px';
        $lineHeight = $originalLineHeight ?? '20px';
        break;
}
$lineHeightStyle = $lineHeight ? "line-height: {$lineHeight};" : "line-height: 140%;";
$letterSpacingStyle = $letterSpacing !== null ? "letter-spacing: {$letterSpacing};" : "";

@endphp
<{{$as}} class="paragraph" style="color: {{$color}}; font-style: {{$fontStyle}}; font-size: {{$fontSize}}; font-weight:{{$weight}};margin-bottom: {{ $spaceBottom }}; margin-top: {{ $spaceTop }}; margin-left: {{ $spaceLeft }}; margin-right: {{ $spaceRight }}; padding:0; box-sizing: border-box; {{ $lineHeightStyle }} {{ $letterSpacingStyle }} text-align: {{$align}}; word-break: break-word; overflow-wrap: break-word;">
    {{ $slot }}
</{{$as}}>
