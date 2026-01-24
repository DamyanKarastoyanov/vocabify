<?php

namespace Domain\Payment\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateBankTransferStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'payment_status_id' => 'required|numeric|exists:payment_statuses,id',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'payment_status.required' => 'Payment status is required.',
            'payment_status.numeric' => 'Payment status must be a number.',
            'payment_status.exists' => 'The selected payment status is invalid.',
        ];
    }
}
