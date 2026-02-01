<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Practice Test – {{ $datasetName ?? 'Vocabulary' }}</title>
    <style>
        @page {
            size: A4;
            margin: 14mm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: ipag, 'DejaVu Sans', sans-serif;
            font-size: 9.5pt;
            line-height: 1.2;
            margin: 0;
            padding: 0;
        }
        h1 {
            text-align: center;
            font-size: 12pt;
            margin: 0 0 10px 0;
        }
        .two-cols {
            width: 100%;
            border-collapse: collapse;
        }
        .two-cols .col {
            width: 50%;
            vertical-align: top;
            padding: 0 8px 0 0;
        }
        .two-cols .col:last-child {
            padding: 0 0 0 8px;
        }
        .question {
            margin: 0 0 3px 0;
        }
        .question-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        .question-table td {
            vertical-align: baseline;
            padding: 0 2px 0 0;
        }
        .question-number {
            font-weight: bold;
            width: 10mm;
            white-space: nowrap;
        }
        .question-text {
            white-space: nowrap;
        }
        .answer-line {
            width: 48mm;
            border-bottom: 0.3pt solid #333;
        }
        .footer-note {
            margin-top: 10px;
            font-size: 8.5pt;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Dataset: {{ $datasetName ?? 'Vocabulary' }}</h1>

    @php
        $total = $words->count();
        $half = (int) ceil($total / 2);
        $leftWords = $words->take($half)->values();
        $rightWords = $words->slice($half)->values();
    @endphp

    <table class="two-cols">
        <tr>
            <td class="col">
                @foreach ($leftWords as $index => $word)
                    <div class="question">
                        <table class="question-table"><tr>
                            <td class="question-number">{{ $index + 1 }}.</td>
                            <td class="question-text">
                                {{ $word->primary_reading }}
                            </td>
                            <td class="answer-line"></td>
                        </tr></table>
                    </div>
                @endforeach
            </td>
            <td class="col">
                @foreach ($rightWords as $index => $word)
                    <div class="question">
                        <table class="question-table"><tr>
                            <td class="question-number">{{ $half + $index + 1 }}.</td>
                            <td class="question-text">
                                {{ $word->primary_reading }}
                            </td>
                            <td class="answer-line"></td>
                        </tr></table>
                    </div>
                @endforeach
            </td>
        </tr>
    </table>

    <div class="footer-note">
        Write the meaning in the blank space. Target: {{ $targetLanguageCode ?? 'JP' }} → Native.
    </div>
</body>
</html>
