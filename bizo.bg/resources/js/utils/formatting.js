/**
 * External dependencies
 */
import currency from 'currency.js';
import { format } from 'date-fns';

export function formatNumber(value, separator = ',', precision = 0) {
    return currency(value, { symbol: '', separator, precision }).format();
}

export function formatPercentage(value, precision = 1, pattern = '# !') {
    const formattedValue = currency(Math.abs(value), {
        symbol: '%',
        separator: '.',
        pattern,
        precision,
    }).format();

    // handle negative values
    return (value < 0 ? '-' : '') + formattedValue;
}

export function formatDate(date, formatString = 'MMM yyyy') {
    return format(date, formatString);
}

export function formatCurrency(value, currencyPrefix = '$', precision = 0, pattern = '! #') {
    return currency(value, { symbol: currencyPrefix, precision, pattern }).format();
}
