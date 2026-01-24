@props([
    'title' => null,
    'icon' => null,
    'serviceTypeName' => null,
    'items' => [],
    'spaceBottom' => '40px',
    'spaceTop' => '0px',
    'width' => '100%',
    'align' => 'center',
    'displayAsTable' => false,
    'propsFontColor' => '#808A93',
    'tableHeaders' => [],
    'tableColumns' => [],
    'titleFontSize' => '20px',
])

<table width="{{ $width }}" align="{{ $align }}" cellpadding="0" cellspacing="0" border="0" style="margin-top: {{ $spaceTop }}; margin-bottom: {{ $spaceBottom }}; background: #E3F2FD; border-radius: 16px;">
    @if($title)
    <tr>
        <td style="height: 96px; background: #E3F2FD; border-radius: 16px 16px 0 0; padding: 24px; vertical-align: middle;">
            <h2 class="heading" style="text-align: center; color: #111827;margin: 0; padding: 0; line-height: 24px; letter-spacing: 0; width: 50%; margin: 0 auto; font-size: {{ $titleFontSize }}; font-weight: 400;">
                {{ $title }}
            </h2>
        </td>
    </tr>
    @endif
    
    <tr>
        <td style="padding: 0 2px 4px 2px;">
            <table width="99.5%" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="background: #FFFFFF; border-radius: 16px;">
                <tr>
                    <td style="padding: 30px;">
            @if($icon || $serviceTypeName)
            <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td style="padding: 0px 24px 16px; margin: 0 auto; width: 100%;">
                        @if($serviceTypeName)
                        @component('emails.components.insurance-icon', ['serviceTypeName' => $serviceTypeName])
                        @endcomponent
                        @endif
                        
                        @if($serviceTypeName)
                        <p class="paragraph" style="color: {{ $propsFontColor }}; font-size: 16px; font-weight: 350; margin: 0; padding: 0; line-height: 140%; text-align: center;">
                            {{ $serviceTypeName }}
                        </p>
                        @endif
                    </td>
                </tr>
            </table>
            @endif
            
            @if(!empty($items))
                @if($displayAsTable)
                    @php
                        $tableRows = [];
                        $tableRows[] = '| ' . implode(' | ', $tableHeaders) . ' |';
                        $tableRows[] = '|' . str_repeat(':--------|', count($tableHeaders));
                        foreach($items as $item) {
                            $row = [];
                            foreach($tableColumns as $columnKey) {
                                $row[] = $item[$columnKey] ?? '-';
                            }
                            $tableRows[] = '| ' . implode(' | ', $row) . ' |';
                        }
                    @endphp
                    @component('mail::table')
                    @foreach($tableRows as $row)
                    {{ $row }}
                    @endforeach
                    @endcomponent
                @else
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                        @foreach($items as $index => $item)
                        @php
                            $isExpiredLabel = ($item['label'] ?? '') === 'Изтекъл на:' || ($item['label'] ?? '') === 'Изтекла на:';
                            $valueColor = $isExpiredLabel ? '#FF4D79' : '#2D304F';
                            $isLastItem = $index === count($items) - 1;
                            $isSingleItem = count($items) === 1;
                            $paddingBottom = ($isLastItem || $isSingleItem) ? '0px' : '20px';
                            $tdStyle = 'vertical-align: top; padding-bottom: ' . $paddingBottom . ';' . ($index === 0 ? ' padding-top: 20px;' : '');
                        @endphp
                        <tr>
                            <td style="{{ $tdStyle }}">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr style='padding: 0px 24px;'>
                                        <td class="paragraph" style="color: {{ $propsFontColor }}; line-height: 140%;vertical-align: top; padding-right: 8px; white-space: nowrap;">
                                            {{ $item['label'] ?? '' }}
                                        </td>
                                        <td class="paragraph" style="white-space: nowrap; color: {{ $valueColor }}; line-height: 140%; vertical-align: top; text-align: right; padding-left: 8px;">
                                            {!! $item['value'] ?? '' !!}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        @endforeach
                    </table>
                @endif
            @endif
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

