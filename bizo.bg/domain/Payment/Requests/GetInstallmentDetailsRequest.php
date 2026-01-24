<?php

namespace Domain\Payment\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GetInstallmentDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $installment = $this->route('installment');

        return Auth::user()->can('view', $installment);
    }
}
