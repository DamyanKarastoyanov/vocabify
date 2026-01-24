<?php

namespace Domain\Payment\Models;

use Illuminate\Database\Eloquent\Model;

class CurrencyCode extends Model
{
    protected $table = 'currency_codes';

    protected $fillable = [
        'name',
        'alphabetic_code',
        'numeric_code',
    ];

    public $timestamps = false;

    public const EUR_NUMERIC_CODE = 978;

    /**
     * Get the currency code by its code.
     *
     * @param string $code
     * @return CurrencyCode|null
     */
    public static function getByCode(string $code): ?self
    {
        return self::where('alphabetic_code', $code)->orWhere('numeric_code', $code)->first();
    }
}
