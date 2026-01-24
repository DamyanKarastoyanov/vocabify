<?php

namespace App\Http\Web\OptIn\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class OptInUnsubscribeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->hasValidSignature();
    }

    public function rules(): array
    {
        return [
            'user' => 'required|integer|exists:users,id',
        ];
    }

    protected function failedAuthorization(): void
    {
        abort(403, 'Invalid or expired unsubscribe link.');
    }

    protected function failedValidation(Validator $validator): void
    {
        abort(422, 'Invalid unsubscribe parameters.');
    }
}
