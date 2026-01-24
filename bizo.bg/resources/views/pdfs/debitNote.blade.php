<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 40px 40px; }
        body { font-family: DejaVu Sans, sans-serif; color: #2D304F; font-size: 12px; }
        .title { text-align: center; font-weight: 700; font-size: 22px; margin-bottom: 20px; }
        .label { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #cfd3dc; padding: 8px; vertical-align: top; }
        th { background: #f3f4f7; text-align: left; }
        .no-border td { border: none; padding: 2px 0; }
        .right { text-align: right; }
        .summary { margin-top: 10px; width: 100%; }
        .footer { margin-top: 30px; }
        .watermark {
            position: fixed;
            top: 35%; left: 0; right: 0;
            text-align: center;
            color: #2D304F33;
            -webkit-transform: rotate(-35deg);
            transform: rotate(-35deg);
            font-size: 48px; font-weight: 700;
        }
    </style>
    <title>Дебитно писмо</title>
</head>
<body>
<div class="watermark">{{ $data['watermark'] ?? '' }}</div>

<div class="title">ДЕБИТНО ПИСМО</div>

<table class="no-border" style="margin-top:0;">
    <tr>
        <td style="width:50%;">
            <div><span class="label">Клиент:</span> {{ $data['client']['name'] ?? '' }}</div>
            <div><span class="label">Град:</span> {{ $data['client']['city'] ?? '' }}</div>
            <div><span class="label">Адрес:</span> {{ $data['client']['address'] ?? '' }}</div>
            <div><span class="label">{{ $data['client']['pin_type'] ?? '' }}:</span> {{ $data['client']['pin'] ?? '' }}</div>
        </td>
        <td style="width:50%;">
            <div><span class="label">Доставчик:</span> {{ $data['supplier']['name'] ?? '' }}</div>
            <div><span class="label">Град:</span> {{ $data['supplier']['city'] ?? '' }}</div>
            <div><span class="label">Адрес:</span> {{ $data['supplier']['address'] ?? '' }}</div>
            <div><span class="label">ЕИК:</span> {{ $data['supplier']['eik'] ?? '' }}</div>
            <div><span class="label">Представляван от:</span> {{ $data['supplier']['representative'] ?? '' }}</div>
        </td>
    </tr>
</table>

<table>
    <thead>
    <tr>
        <th style="width: 30px">№</th>
        <th>Основание за плащане Полицa / Вид застраховка</th>
        <th style="width: 70px">Вноска №</th>
        <th style="width: 200px">Застрахован обект</th>
        <th style="width: 90px">Падеж</th>
        <th style="width: 120px" class="right">Обща премия</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>1</td>
        <td>
            {{ $data['policy_number'] ?? '' }}<br/>
            {{ $data['policy_insurance_type'] ?? '' }}
        </td>
        <td class="right">{{ $data['installment_sequence'] ?? '' }}</td>
        <td>{{ $data['insured_object'] ?? '-' }}</td>
        <td>{{ $data['due_date'] ?? '' }}</td>
        <td class="right">{{ $data['amount'] ?? '' }} {{ $data['currency'] ?? '' }}</td>
    </tr>
    </tbody>
</table>

<table class="summary">
    <tr>
        <td style="border: none; font-weight: 700;">Обща дължима сума</td>
        <td style="border: none; text-align: right; font-weight: 700;">{{ $data['amount'] ?? '' }} {{ $data['currency'] ?? '' }}</td>
    </tr>
    </table>

<div class="footer">
    <div>В случай че пропуснете да ги заплатите преди техния краен срок да изтече, има опасност застраховките Ви да бъдат прекратени.</div>

    <table class="no-border" style="margin-top: 10px;">
        <tr>
            <td style="width:50%; vertical-align: top;">
                <div><span class="label">Дата на създаване:</span> {{ $data['created_at'] ?? '' }}</div>
                <div><span class="label">Място на издаване:</span> София</div>
                <div><span class="label">Създадено от:</span> {{ $data['created_by'] ?? '' }}</div>
            </td>
            <td style="width:50%; vertical-align: top;">
                <div><span class="label">Начин на плащане:</span> {{ $data['payment_method'] ?? '' }}</div>
                <div><span class="label">IBAN:</span> {{ $data['bank']['iban'] ?? '' }}</div>
                <div><span class="label">Банка:</span> {{ $data['bank']['bank'] ?? '' }}</div>
                <div><span class="label">BIC:</span> {{ $data['bank']['bic'] ?? '' }}</div>
                <div><span class="label">Титуляр на сметката:</span> {{ $data['bank']['account_holder'] ?? '' }}</div>
            </td>
        </tr>
    </table>

    <div style="margin-top: 14px; font-size: 11px;">
        * Моля, посочете като основание за плащане номер на полица или регистрационен номер!
    </div>
</div>

</body>
</html>

