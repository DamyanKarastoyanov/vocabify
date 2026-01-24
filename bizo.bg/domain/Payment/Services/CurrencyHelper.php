<?php

namespace Domain\Payment\Services;

class CurrencyHelper
{
    public const EUR_TO_BGN_RATIO = 1.95583;

    public const CURRENCY_SUFFIXES = [
        'BGN' => 'лв.',
        'EUR' => '€',
    ];

    /**
     * gives "23.00 лв. / 11.77€"
     */
    public static function dualPricing(float $originalAmount, ?string $currencyCode): array
    {
        $code = strtoupper($currencyCode ?: 'BGN');

        if ($code === 'EUR') {
            return [
                'formatted' => number_format($originalAmount, 2) . ' ' . self::CURRENCY_SUFFIXES['EUR'],
            ];
        }

        $amountBgn = $code === 'BGN'
            ? $originalAmount
            : $originalAmount * self::EUR_TO_BGN_RATIO;

        $amountEur = $code === 'EUR'
            ? $originalAmount
            : $originalAmount / self::EUR_TO_BGN_RATIO;

        $bgnSuffix = self::CURRENCY_SUFFIXES['BGN'];
        $eurSuffix = self::CURRENCY_SUFFIXES['EUR'];

        $bgnText = number_format($amountBgn, 2) . ' ' . $bgnSuffix;
        $eurText = number_format($amountEur, 2) . $eurSuffix;

        return [
            'formatted' => $bgnText . ' / ' . $eurText,
        ];
    }
}


