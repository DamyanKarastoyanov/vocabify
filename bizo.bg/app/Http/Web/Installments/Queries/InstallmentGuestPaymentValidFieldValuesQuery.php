<?php

namespace App\Http\Web\Installments\Queries;

use Illuminate\Http\Request;

class InstallmentGuestPaymentValidFieldValuesQuery
{
    protected $installmentGuestPaymentStep;

    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->installmentGuestPaymentStep = $request->input('step', '1');
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        switch ($this->installmentGuestPaymentStep) {
            case '1':
                return [
                    'payment_method' => [
                        ['value' => 'card', 'label' => 'Плащане с карта'],
                        ['value' => 'bank_transfer', 'label' => 'Банков превод'],
                    ],
                ];
            default:
                return [];
        }
    }
}
