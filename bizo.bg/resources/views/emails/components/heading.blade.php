@props([
    'spaceBottom' => '0',
    'spaceTop' => '0',
    'color' => '#001527',
    'align' => 'left',
    'name' => null,
    'greetingSize' => 'h3',
    'subGreeting' => null,
    'subGreetingSize' => 'h4',
    'subGreetingFontSize' => '18px',
    'width' => '100%',
])

@php
$attributes = $attributes->merge(['greetingSize' => $greetingSize, 'spaceBottom' => $spaceBottom, 'spaceTop' => $spaceTop, 'align' => $align, 'name' => $name, 'subGreeting' => $subGreeting, 'width' => $width]);
$size = $attributes->get('size');
$spaceBottom = $attributes->get('spaceBottom');
$spaceTop = $attributes->get('spaceTop');
$align = $attributes->get('align');
$name = $attributes->get('name');
$greetingSize = $attributes->get('greetingSize');
$subGreeting = $attributes->get('subGreeting');
$subGreetingSize = $attributes->get('subGreetingSize');
$width = $attributes->get('width');
$headingTag = 'h2';

switch ($size) {
    case 'h3':
        $greetingFontSize = '30px';
        $headingTag = 'h1';
        break;
    case 'h4':
        $greetingFontSize = '26px';
        $headingTag = 'h2';
        break;
    case 'h5':
        $greetingFontSize = '22px';
        $headingTag = 'h2';
        break;
    default:
        $greetingFontSize = '28px';
        $headingTag = 'h2';
        break;
}

@endphp
<table width="{{ $width }}" align="center" cellpadding="0" cellspacing="0" border="0" style="margin-top: {{ $spaceTop }}; margin-bottom: {{ $spaceBottom }};">
    <tr>
        <td>
            @if(!empty($name))
                <p class="heading" style="color: {{ $color }}; font-size: {{$greetingFontSize}}; font-weight:700;margin-bottom: {{ $subGreeting ? '8px' : '0' }}; margin-top: 0; padding:0; box-sizing: border-box; line-height: 120%; text-align: center;">
                    Здравей, {{ $name }}!
                </p>
            @else
                <p class="heading" style="color: {{ $color }}; font-size: {{$greetingFontSize}}; font-weight:700;margin-bottom: {{ $subGreeting ? '8px' : '0' }}; margin-top: 0; padding:0; box-sizing: border-box; line-height: 120%; text-align: center;">
                    Здравей!
                </p>
            @endif
            @if(!is_null($subGreeting))
                <p class="heading" style="color : {{ $color }}; font-size: {{ $subGreetingFontSize }}; margin: 0 0 0 0; padding: 0; line-height: 24px; letter-spacing: 0%; text-align: center;">
                    {{ $subGreeting }}
                </p>
            @endif
        </td>
    </tr>
</table>
