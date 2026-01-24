@props([
    'url' => '#',
    'button' => 'green',
    'spaceBottom' => '0',
    'spaceTop' => '0',
    'width' => '100%',
    'spaceLeft' => '0',
    'spaceRight' => '0',
    'align' => 'center',
])
@php
$attributes = $attributes->merge(['url' => $url, 'button' => $button, 'spaceBottom' => $spaceBottom, 'spaceTop' => $spaceTop,'spaceLeft' => $spaceLeft, 'spaceRight' => $spaceRight, 'width' => $width]);
$url = $attributes->get('url');
$button = $attributes->get('button');
$spaceBottom = $attributes->get('spaceBottom');
$spaceTop = $attributes->get('spaceTop');
$spaceLeft = $attributes->get('spaceLeft');
$spaceRight = $attributes->get('spaceRight');
$width = $attributes->get('width');

// Primary variant colors matching React button component
$backgroundColor = '#0081ea'; // --bz-color-brand-500
$hoverBackgroundColor = '#006ed0';
$activeBackgroundColor = '#0057a6';
$fontColor = '#FFFFFF'; // --bz-color-text-inverse
$borderRadius = '12px'; // 0.75rem --bz-border-radius-300
$fontSize = '18px'; // 1rem --bz-font-size-l
$fontWeight = '500'; // --bz-font-weight-medium
$lineHeight = '24px'; // 16px * 1.5 --bz-line-height
$height = '48px'; // 3rem
$paddingInline = '24px'; // --bz-space-600

@endphp
<table width="{{ $width }}" align="{{ $align }}" dir="ltr" class="cta" style="border:0;border-collapse:collapse;margin-top:0px;padding:0;" border="0" cellpadding="0" cellspacing="0">
    <tbody>
    <tr>
        <td style="padding-bottom: {{ $spaceBottom }}; padding-top: {{ $spaceTop }} ; padding-left: {{ $spaceLeft }}; padding-right: {{ $spaceRight }};text-align:center" align="center">
            <a href="{!! $url !!}"
               style="width:100%;
               background: {{ $backgroundColor }};
               border-radius:{{ $borderRadius }};
               color: {{ $fontColor }};
               display:inline-block;
               font-weight:{{ $fontWeight }};
               line-height:{{ $height }};
               margin:0 auto;
               font-size: {{ $fontSize }};
               text-align:center;
               text-decoration:none;
               padding-left:{{ $paddingInline }};
               padding-right:{{ $paddingInline }};
               min-height:{{ $height }};
               " bgcolor="{{ $backgroundColor }}" align="center" target="_blank">
                {{ $slot }}
            </a>
        </td>
    </tr>
    </tbody>
</table>

